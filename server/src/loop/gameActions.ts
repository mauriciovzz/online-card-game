import { gameService } from "@/services";
import deckHelper from "@/utils/deckHelper";

import {
  emitGameData,
  emitPlayerHand,
  emitTurn,
  emitEffect,
  emitUnoCall,
  emitCutInfo,
} from "@/utils/emiterHelper";

import {
  Room,
  Game,
  Turn,
  PlayerState,
  Card,
  PlayedCard,
} from "@shared/types";

import { AppServer, AppSocket } from "@/types";
import { startTurn, endGame } from "./gameLoop";

export const drawCard = (
  io: AppServer,
  turnData: {
    room: Room;
    game: Game;
    turn: Turn;
    state: PlayerState;
  }
) => {
  const { room, game, turn, state } = turnData;

  turn.cardDraw = true;
  emitTurn(io, room.id, turn);

  const updatedHand = deckHelper.draw(state, 1, game);
  emitPlayerHand(io, state.id, updatedHand);

  emitGameData(io, room.id, gameService.getState(game));

  return updatedHand;
};

export const endTurn = (
  io: AppServer,
  roomId: string,
  game: Game
) => {
  gameService.advanceTurn(game);
  startTurn(io, roomId);
};

export const endStack = (
  io: AppServer,
  turnData: {
    room: Room;
    game: Game;
    turn: Turn;
    state: PlayerState;
  }
) => {
  const { room, game, turn, state } = turnData;

  if (turn.effect !== "SKIP") {
    const nc = game.currDrawStack;
    game.currDrawStack = 0;

    const updatedHand = deckHelper.draw(state, nc, game);
    emitPlayerHand(io, state.id, updatedHand);

    const numCards = updatedHand.cards.length;
    emitEffect(io, state.id, state.pos, numCards);

    emitGameData(io, room.id, gameService.getState(game));
  } else {
    emitEffect(io, state.id, state.pos);
  }

  endTurn(io, room.id, game);
};

const aiCut = (
  io: AppServer,
  room: Room,
  game: Game,
  targetId: string,
  cutter: PlayerState
) => {
  const target = game.players.find(
    (p) => p.id === targetId
  );

  if (!target) return;
  if (target.calledUno) return;
  if (target.cards.length !== 1) return;
  if (Math.random() > 0.7) return;

  const data = {
    room,
    game,
    cutted: target,
    cutter,
  };

  callCut(io, data);
};

const scheduleAiCuts = (
  io: AppServer,
  room: Room,
  game: Game,
  targetId: string
) => {
  const aiPlayers = game.players.filter(
    (p) => p.type === "ai" && p.id !== targetId
  );

  for (const ai of aiPlayers) {
    const random = Math.floor(Math.random() * 10) + 1;
    const delay = 5000 + random * 1000;

    setTimeout(() => {
      aiCut(io, room, game, targetId, ai);
    }, delay);
  }
};

export const playCard = (
  io: AppServer,
  turnData: {
    room: Room;
    game: Game;
    turn: Turn;
    state: PlayerState;
  },
  playedCard: PlayedCard
) => {
  const { room, game, turn, state } = turnData;
  const { cardId, chosenColor } = playedCard;

  const findCard = (c: Card) => c.id === cardId;
  const playedCardIndex = state.cards.findIndex(findCard);
  if (playedCardIndex === -1) return;

  const card = state.cards.splice(playedCardIndex, 1)[0];

  const isWildcard = card.type === "WILD_CARD";
  const isDrawFour = card.type === "DRAW_FOUR";

  if ((isWildcard || isDrawFour) && chosenColor) {
    card.color = chosenColor;
  }

  game.pile.push(card);
  game.topCard = card;
  gameService.applyEffect(game, card.type);

  turn.cardPut = true;

  emitTurn(io, room.id, turn);
  emitGameData(io, room.id, gameService.getState(game));

  if (state.cards.length === 0) {
    const losers = [...game.players];

    endGame(io, room, state, losers);
    return;
  }

  if (state.cards.length === 1 && !state.calledUno) {
    scheduleAiCuts(io, room, game, state.id);
  }

  // handle reverse card with 2 players
  const twoPlayers = room.players.length === 2;
  const reverseCard = card.type === "REVERSE";

  if (twoPlayers && reverseCard) {
    gameService.advanceTurn(game);

    const player = game.players[game.currPlayerIndex];
    emitEffect(io, player.id, player.pos);

    endTurn(io, room.id, game);
    return;
  }

  // handle chain rules
  const { mirror, stair } = room.rules;

  const hasChainRule = mirror || stair;
  const playedNumberCard = card.type === "NUMBER";

  const canContinueTurn = hasChainRule && playedNumberCard;

  if (!canContinueTurn) {
    endTurn(io, room.id, game);
  }
};

export const callUno = (
  io: AppServer,
  turnData: {
    room: Room;
    game: Game;
    state: PlayerState;
  },
  socket?: AppSocket
) => {
  const { room, game, state } = turnData;

  state.calledUno = true;

  const gameState = gameService.getState(game);
  emitGameData(io, room.id, gameState);

  const notificationData = {
    name: state.name,
    pos: state.pos,
  };

  emitUnoCall(socket ?? io, room.id, notificationData);
};

export const callCut = (
  io: AppServer,
  turnData: {
    room: Room;
    game: Game;
    cutter: PlayerState;
    cutted: PlayerState;
  },
  socket?: AppSocket
) => {
  const { room, game, cutter, cutted } = turnData;

  const updatedHand = deckHelper.draw(cutted, 2, game);
  emitPlayerHand(io, cutted.id, updatedHand);

  const gameState = gameService.getState(game);
  emitGameData(io, room.id, gameState);

  const cutInfo = {
    cuttedId: cutted.id,
    cuttedName: cutted.name,
    cuttedPos: cutted.pos,

    cutterName: cutter.name,
    cutterPos: cutter.pos,
  };

  emitCutInfo(socket ?? io, room.id, cutInfo);
};
