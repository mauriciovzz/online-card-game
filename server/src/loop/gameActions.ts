import { gameService } from "@/services";
import deckHelper from "@/utils/deckHelper";

import {
  emitGameData,
  emitPlayerHand,
  emitTurn,
  emitEffect,
} from "@/utils/emiterHelper";

import {
  Room,
  Game,
  Turn,
  PlayerState,
  Card,
  PlayedCard,
} from "@shared/types";

import { AppServer } from "@/types";
import { startTurn, finishGame } from "./gameLoop";
import logger from "@/utils/logger";

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

const checkIfReverseIsSkip = (
  io: AppServer,
  room: Room,
  game: Game,
  state: PlayerState,
  card: Card
) => {
  const twoPlayers = room.players.length === 2;
  const reverseCard = card.type === "REVERSE";

  if (twoPlayers && reverseCard) {
    gameService.advanceTurn(game);

    const player = game.players[game.currPlayerIndex];
    emitEffect(io, player.id, player.pos);

    logger.info(`[${state.name}] ENDED TURN ON REVERSE`);
    endTurn(io, room.id, game);
    return true;
  }

  return false;
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

  logger.playCard(
    state.name,
    card.raw,
    state.cards.map((c) => c.raw)
  );

  if (state.cards.length === 0) {
    finishGame(io, room, state);
    return;
  }

  emitTurn(io, room.id, turn);
  emitGameData(io, room.id, gameService.getState(game));

  if (checkIfReverseIsSkip(io, room, game, state, card)) {
    return;
  }

  const { mirror, stair } = room.rules;

  const hasChainRule = mirror || stair;
  const playedNumberCard = card.type === "NUMBER";

  const canContinueTurn = hasChainRule && playedNumberCard;

  if (!canContinueTurn) {
    logger.info(`[${state.name}] ENDED TURN ON RULES`);
    endTurn(io, room.id, game);
  }
};
