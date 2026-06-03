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
  ok,
} from "@/utils/emiterHelper";
import {
  getGameData,
  getTurnData,
  isInRoom,
} from "@/utils/guards";

import {
  Room,
  Game,
  Turn,
  PlayerState,
  Card,
  PlayedCard,
  Player,
  EmptyResponse,
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
  const turnData = getTurnData(io, roomId);
  if (!turnData) return;

  const { room, game, turn } = turnData;

  const hasStackEffect =
    room.rules.stack && game.currEffect;

  if (hasStackEffect) {
    const find = (p: PlayerState) => p.id === playerId;
    const state = game.players.find(find);
    if (!state) return;

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

  gameService.advanceTurn(game);
  startTurn(io, roomId);
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

  const roomCapacity = Number(room.capacity);
  const members = room.players.length;
  const isRoomFull = roomCapacity === members;

  if (!isRoomFull) {
    room.state = "WAITING";

    emitRoomData(io, room);
    broadcastRoomList(io, roomService.getAvailable());
  }
};

const playCard = (
  io: AppServer,
  callback: SocketCallback<EmptyResponse>,
  turnData: { room: Room; game: Game; turn: Turn },
  playerId: string,
  playedCard: PlayedCard
) => {
  const { room, game, turn } = turnData;
  const { cardId, chosenColor } = playedCard;

  const findPlayer = (p: PlayerState) => p.id === playerId;
  const player = game.players.find(findPlayer);
  if (!player) return;

  const findCard = (c: Card) => c.id === cardId;
  const playedCardIndex = player.cards.findIndex(findCard);
  if (playedCardIndex === -1) return;

  const cardPut = player.cards.splice(
    playedCardIndex,
    1
  )[0];

  const isWildcard = cardPut.type === "WILD_CARD";
  const isDrawFour = cardPut.type === "DRAW_FOUR";

  if ((isWildcard || isDrawFour) && chosenColor) {
    cardPut.color = chosenColor;
  }

  game.pile.push(cardPut);
  game.topCard = cardPut;

  turn.cardPut = true;

  gameService.applyEffect(game, cardPut.type);

  if (player.cards.length === 0) {
    finishGame(io, room, player);
    return;
  }

  ok(callback, null);
  emitTurn(io, room.id, turn);

  emitGameData(io, room.id, gameService.getState(game));

  if (
    room.players.length === 2 &&
    cardPut.type === "REVERSE"
  ) {
    gameService.advanceTurn(game);

    const player = game.players[game.currPlayerIndex];
    emitEffect(io, player.id, player.pos);

    gameService.advanceTurn(game);
    startTurn(io, room.id);
    return;
  }

  // This code autoskips if you dont have a card to play when mirror or stairs
  // is on, but it also lets the player now that they have something to play

  const { mirror, stair } = room.rules;

  // const canMirror =
  //   !mirror ||
  //   cardPut.type !== "NUMBER" ||
  //   !player.cards.some((c) => c.raw === cardPut.raw);

  // const canStair =
  //   !stair ||
  //   cardPut.type !== "NUMBER" ||
  //   !player.cards.some(
  //     (c) =>
  //       c.type === "NUMBER" &&
  //       c.number === cardPut.number + 1
  //   );

  // if (canMirror && canStair) {
  //   gameService.advanceTurn(game);
  //   startTurn(io, room.id);
  // }

  const notNumber = cardPut.type !== "NUMBER";

  if ((!mirror && !stair) || notNumber) {
    gameService.advanceTurn(game);
    startTurn(io, room.id);
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

  if (room.players.length === 1) {
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

export { startTurn, playCard, handleExit };
