import { games, timers, turns } from "@/stores";
import deckHelper from "@/utils/deckHelper";

import {
  Room,
  Game,
  CardEffect,
  CardType,
  GameState,
  Player,
  HandState,
  Turn,
} from "@shared/types";

const getNextPlayerIndex = (game: Game) => {
  const { direction, players, currPlayerIndex } = game;
  const members = players.length;
  return (currPlayerIndex + direction + members) % members;
};

const adjustPlayerIndex = (
  currentPlayerIndex: number,
  removedIndex: number,
  playersLeft: number,
  direction: 1 | -1,
): number => {
  if (removedIndex < currentPlayerIndex) {
    return currentPlayerIndex - 1;
  }

  if (removedIndex === currentPlayerIndex) {
    if (direction === 1) {
      return currentPlayerIndex % playersLeft;
    }

    return (currentPlayerIndex - 1 + playersLeft) % playersLeft;
  }

  return currentPlayerIndex;
};

// ------------------------------------------------------------

const createGame = (room: Room) => {
  const { deck, pile } = deckHelper.createDeck();

  const players = [...room.players]
    .sort((a, b) => a.pos - b.pos)
    .map((p) => ({
      ...p,
      cards: deck.splice(0, 7),
      calledUno: false,
    }));

  const firstPlayer = room.currWinner ?? room.adminId;

  const currPlayerIndex = room.players.findIndex((p) => p.id === firstPlayer);

  const game: Game = {
    players,
    currPlayerIndex,

    deck,
    pile,
    direction: 1,

    topCard: pile[0],

    currEffect: null,
    nextEffect: null,
    currDrawStack: 0,
  };

  games.set(room.id, game);
};

const createTurn = (
  roomId: string,
  turnDuration: number,
  currentPlayerId: string,
  effect: CardEffect,
) => {
  const now = new Date().getTime();

  const turn = {
    startTime: now,
    expiresAt: now + turnDuration,
    effect,

    currentPlayerId,

    actions: {
      draw: true,
      play: true,
      end: false,
    },
  };

  turns.set(roomId, turn);

  return turn;
};

const afterDraw = (turn: Turn) => {
  turn.actions.draw = false;
  turn.actions.play = true;
  turn.actions.end = true;
};

const afterPlay = (turn: Turn) => {
  turn.actions.draw = false;
  turn.actions.play = false;
  turn.actions.end = true;
};

const getState = (game: Game): GameState => ({
  players: game.players.map((p) => {
    const { cards, ...rest } = p;

    return {
      ...rest,
      numCards: cards.length,
    };
  }),

  direction: game.direction,
  topCard: game.topCard,
  currDrawStack: game.currDrawStack,
});

const getHand = (game: Game, id: string) => {
  const state = game.players.find((p) => p.id === id);
  if (!state) return { cards: [], calledUno: false };

  return {
    cards: state.cards.map((card) => ({ ...card })),
    calledUno: state.calledUno,
  };
};

const autoDraw = (game: Game): HandState => {
  const cardsToDraw = 1;

  const updatedHand = deckHelper.draw(
    game.players[game.currPlayerIndex],
    cardsToDraw,
    game,
  );

  return updatedHand;
};

const advanceTurn = (game: Game) => {
  game.currEffect = game.nextEffect;
  game.nextEffect = null;
  game.currPlayerIndex = getNextPlayerIndex(game);
};

const skipTurn = (game: Game): HandState | undefined => {
  let updatedHand: HandState | undefined = undefined;

  if (game.currEffect !== "SKIP") {
    updatedHand = deckHelper.draw(
      game.players[game.currPlayerIndex],
      game.currDrawStack,
      game,
    );

    game.currDrawStack = 0;
  }

  game.currPlayerIndex = getNextPlayerIndex(game);
  game.currEffect = null;
  game.nextEffect = null;

  return updatedHand;
};

const applyEffect = (game: Game, type: CardType) => {
  switch (type) {
    case "SKIP":
      game.nextEffect = type;
      break;
    case "REVERSE":
      game.direction = game.direction === 1 ? -1 : 1;
      break;
    case "DRAW_TWO":
      game.nextEffect = type;
      game.currDrawStack += 2;
      break;
    case "DRAW_FOUR":
      game.nextEffect = type;
      game.currDrawStack += 4;
      break;
  }
};

const cleanUp = (roomId: string) => {
  const timer = timers.get(roomId);
  if (timer) clearTimeout(timer);

  timers.delete(roomId);
  turns.delete(roomId);
  games.delete(roomId);
};

const leave = (game: Game, playerId: string) => {
  const find = (p: Player) => p.id === playerId;
  const playerIndex = game.players.findIndex(find);

  const newIndex = adjustPlayerIndex(
    game.currPlayerIndex,
    playerIndex,
    game.players.length - 1,
    game.direction,
  );

  game.currEffect = null;
  game.nextEffect = null;
  game.currDrawStack = 0;

  game.deck.push(...game.players[playerIndex].cards);
  game.players.splice(playerIndex, 1);
  game.currPlayerIndex = newIndex;

  return playerIndex === game.currPlayerIndex;
};

export default {
  createGame,
  createTurn,

  afterDraw,
  afterPlay,

  getHand,
  getState,
  autoDraw,
  applyEffect,
  skipTurn,
  advanceTurn,
  leave,
  cleanUp,
};
