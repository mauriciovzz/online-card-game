import { rooms, games, timers } from "@/stores";
import { roomService, gameService } from "@/services";
import {
  broadcastRoomList,
  emitGameData,
  emitPlayerHand,
  emitPlayerQuit,
  emitRoomData,
  emitTimeout,
  emitTurn,
  ok,
} from "@/utils/emiterHelper";
import cardsHelper from "@/utils/cardsHelper";
import {
  getTurnData,
  getGameData,
  isPlayerInRoom,
} from "@/utils/guards";

import {
  Room,
  ParsedCard,
  Game,
  Turn,
  Card,
  PlayerHand,
} from "@shared/types";
import {
  AppServer,
  AppSocket,
  SocketCallback,
} from "@/types";

const timeout = (
  io: AppServer,
  roomId: string,
  playerId: string
) => {
  const data = getGameData(roomId);
  if (!data) return;

  const { room, game, turn } = data;

  emitTimeout(io, room.id, playerId);

  const usedACard = turn.cardPut || turn.cardDraw;

  if (!usedACard && game.currEffect !== "SKIP") {
    gameService.autoDraw(game);

    const playerId = game.players[game.currPlayerIndex].id;

    const hand = gameService.getHand(game, playerId);
    emitPlayerHand(io, playerId, hand);

    const gameState = gameService.getState(game);
    emitGameData(io, room.id, gameState);
  }

  gameService.advanceTurn(game);

  startTurn(io, roomId);
};

const startTurn = (io: AppServer, roomId: string) => {
  const data = getTurnData(roomId);
  if (!data) return;

  const { room, game } = data;

  const existingTimer = timers.get(room.id);
  if (existingTimer) clearTimeout(existingTimer);

  if (game.currEffect && !room.rules.stack) {
    const effect = game.currEffect;
    const skipped = game.players[game.currPlayerIndex].id;

    gameService.skipTurn(game);

    if (effect !== "SKIP") {
      const hand = gameService.getHand(game, skipped);
      emitPlayerHand(io, skipped, hand);

      const gameState = gameService.getState(game);
      emitGameData(io, room.id, gameState);
    }
  }

  const currPlayerIndex = game.currPlayerIndex;
  const currPlayerId = game.players[currPlayerIndex].id;

  const turn = gameService.createTurn(
    room.id,
    currPlayerId,
    game.currEffect
  );

  emitTurn(io, room.id, turn);

  const countDown = Number(room.turnDuration) * 1000;

  const timer = setTimeout(() => {
    timeout(io, roomId, currPlayerId);
  }, countDown);

  timers.set(room.id, timer);
};

// ok
const winGame = (
  io: AppServer,
  room: Room,
  winnerId: string
) => {
  io.to(room.id).emit("game:won", { playerId: winnerId });

  gameService.cleanUp(room.id);

  const roomCap = Number(room.capacity);
  const members = room.players.length;

  const isRoomFull = roomCap === members;
  room.state = isRoomFull ? "FULL" : "WAITING";

  emitRoomData(io, room);

  if (!isRoomFull) {
    broadcastRoomList(io, roomService.getAvailable());
  }

  return;
};

interface PlayerData {
  id: string;
  hand: Card[];
  card: ParsedCard;
}

// ok
const playCard = (
  io: AppServer,
  callback: SocketCallback<PlayerHand>,
  { id, hand, card }: PlayerData,
  room: Room,
  game: Game,
  turn: Turn
) => {
  cardsHelper.put(card.raw, hand, game.pile);

  game.topCard = card;
  turn.cardPut = true;

  gameService.applyEffect(game, card.type);

  if (hand.length === 0) {
    winGame(io, room, id);
  }

  const playerHand = gameService.getHand(game, id);
  ok(callback, playerHand);

  const gameState = gameService.getState(game);
  emitGameData(io, room.id, gameState);

  const { stair, mirror, stack } = room.rules;

  if (!stair && !mirror && !stack) {
    gameService.advanceTurn(game);
    startTurn(io, room.id);
  }
};

const handleExit = (io: AppServer, socket: AppSocket) => {
  const roomId = socket.data.roomId;
  if (!roomId) return;

  const room = rooms.get(roomId);
  if (!room) return;

  const player = isPlayerInRoom(room, socket.id);
  if (!player) {
    console.log("shouldCheck");
    return;
  }

  const roomDeleted = roomService.leave(room, socket.id);

  void socket.leave(room.id);
  socket.data.roomId = undefined;

  const game = games.get(roomId);

  if (!game) {
    if (!roomDeleted) emitRoomData(io, room);
    broadcastRoomList(io, roomService.getAvailable());
    return;
  }

  const gameRes = gameService.leave(game, socket.id);
  if (!gameRes) return;

  const gamestate = gameService.getState(game);
  emitPlayerQuit(socket, room.id, player.name, gamestate);

  if (gameRes.type === "WON") {
    winGame(io, room, gameRes.id);
    return;
  }

  if (room.state === "PLAYING" && gameRes.wasPlaying) {
    startTurn(io, roomId);
  }
};

export { startTurn, playCard, handleExit };
