import { rooms, games, timers } from "@/stores";
import { roomService, gameService } from "@/services";
import {
  broadcastRoomList,
  emitEffect,
  emitGameData,
  emitPlayerHand,
  emitPlayerQuit,
  emitRoomData,
  emitTimeout,
  emitTurn,
  emitWinner,
} from "@/utils/emiterHelper";
import {
  getGameData,
  getTurnData,
  isInRoom,
} from "@/utils/guards";

import {
  Room,
  Game,
  PlayerState,
  Player,
} from "@shared/types";
import { AppServer, AppSocket } from "@/types";
import { startAiTurn } from "./aiLoop";
import logger from "@/utils/logger";
import { endTurn } from "./gameActions";

const timeout = (
  io: AppServer,
  roomId: string,
  playerId: string
) => {
  const turnData = getTurnData(io, roomId);
  if (!turnData) return;

  const { room, game, turn, state } = turnData;

  const hasStackEffect =
    room.rules.stack && game.currEffect;

  if (hasStackEffect) {
    emitEffect(
      io,
      state.id,
      state.pos,
      game.currEffect !== "SKIP"
        ? game.currDrawStack
        : undefined
    );
  } else {
    const hadToDraw = !turn.cardPut && !turn.cardDraw;

    if (hadToDraw) {
      const updatedHand = gameService.autoDraw(game);
      emitPlayerHand(io, playerId, updatedHand);

      const gameState = gameService.getState(game);
      emitGameData(io, room.id, gameState);
    }

    emitTimeout(io, playerId, hadToDraw);
  }

  endTurn(io, roomId, game);
};

const applyPendingEffect = (
  io: AppServer,
  room: Room,
  game: Game
) => {
  const { players, currEffect, currPlayerIndex } = game;

  const affectedPlayer = players[currPlayerIndex];
  const updatedHand = gameService.skipTurn(game);

  if (currEffect !== "SKIP" && updatedHand) {
    emitPlayerHand(io, affectedPlayer.id, updatedHand);

    emitGameData(io, room.id, gameService.getState(game));
  }

  emitEffect(
    io,
    affectedPlayer.id,
    affectedPlayer.pos,
    updatedHand?.cards.length
  );
};

const startTurn = (io: AppServer, roomId: string) => {
  const gameData = getGameData(io, roomId);
  if (!gameData) return;

  const { room, game } = gameData;

  const existingTimer = timers.get(room.id);
  if (existingTimer) clearTimeout(existingTimer);

  if (game.currEffect) {
    if (room.rules.stack) {
      const { players, currEffect, currPlayerIndex } = game;

      const affectedPlayer = players[currPlayerIndex];

      const canPlay = affectedPlayer.cards.some(
        (c) => c.type === currEffect
      );

      if (!canPlay) {
        applyPendingEffect(io, room, game);
      }
    } else {
      applyPendingEffect(io, room, game);
    }
  }

  const currPlayerIndex = game.currPlayerIndex;
  const currPlayerId = game.players[currPlayerIndex].id;

  const turn = gameService.createTurn(
    room.id,
    Number(room.turnDuration) * 1000,
    currPlayerId,
    game.currEffect
  );

  emitTurn(io, room.id, turn);

  const currentPlayer = game.players[currPlayerIndex];

  if (currentPlayer.type === "ai") {
    void startAiTurn(io, room.id);
    return;
  }

  logger.turnStart(currentPlayer.name, game);

  const countDown = Number(room.turnDuration) * 1000;

  const timer = setTimeout(() => {
    timeout(io, roomId, currPlayerId);
  }, countDown);

  timers.set(room.id, timer);
};

const finishGame = (
  io: AppServer,
  room: Room,
  winner: PlayerState,
  playerThatLeft?: string
) => {
  gameService.cleanUp(room.id);

  const winnerInfo = {
    id: winner.id,
    name: winner.name,
    pos: winner.pos,
  };

  emitWinner(io, room.id, winnerInfo, playerThatLeft);

  const roomCapacity = room.capacity;
  const members = room.players.length;
  const isRoomFull = roomCapacity === members;

  if (!isRoomFull) {
    room.state = "WAITING";

    emitRoomData(io, room);
    broadcastRoomList(io, roomService.getAvailable());
  }
};

const handleExit = (io: AppServer, socket: AppSocket) => {
  const roomId = socket.data.roomId;
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) return;

  const player = isInRoom(socket.id, room);
  if (!player) return;

  void socket.leave(room.id);
  socket.data.roomId = undefined;

  const realPlayers = room.players.filter(
    (p) => p.type === "human"
  ).length;

  if (realPlayers === 1) {
    rooms.delete(room.id);
    broadcastRoomList(io, roomService.getAvailable());
    return;
  }

  roomService.leave(room, socket.id);

  const game = games.get(roomId);

  if (!game) {
    emitRoomData(io, room);
    broadcastRoomList(io, roomService.getAvailable());
    return;
  }

  if (game.players.length === 2) {
    const filter = (p: Player) => p.id !== socket.id;
    const winner = game.players.find(filter);
    if (!winner) return;

    finishGame(io, room, winner, player.name);
    return;
  }

  const wasPlaying = gameService.leave(game, socket.id);

  const gamestate = gameService.getState(game);

  emitPlayerQuit(socket, room.id, player.name, gamestate);
  emitRoomData(io, room);

  if (wasPlaying) {
    startTurn(io, roomId);
  }
};

export { startTurn, finishGame, handleExit };
