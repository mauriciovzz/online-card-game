import { games, timers, turns } from "@/stores";
import cardsHelper from "@/utils/cardsHelper";

import {
  Room,
  Game,
  CardEffect,
  CardType,
  GameState,
  LeaveGameRes,
  PlayerSlot,
} from "@/types";

// ok
const getNextPlayerIndex = (game: Game) => {
  const { direction, players, currPlayerIndex } = game;
  const members = players.length;
  return (currPlayerIndex + direction + members) % members;
};

const adjustPlayerIndex = (
  currentPlayerIndex: number,
  removedIndex: number,
  playerCountAfterRemoval: number,
  direction: 1 | -1
): number => {
  if (removedIndex < currentPlayerIndex) {
    return currentPlayerIndex - 1;
  }

  if (removedIndex === currentPlayerIndex) {
    if (direction === 1) {
      return currentPlayerIndex % playerCountAfterRemoval;
    }

    return (
      (currentPlayerIndex - 1 + playerCountAfterRemoval) %
      playerCountAfterRemoval
    );
  }

  return currentPlayerIndex;
};

// ------------------------------------------------------------

// ok
const createGame = (room: Room) => {
  const { deck, pile } = cardsHelper.createDeck();

  const players = room.players.map((p) => ({
    ...p,
    hand: deck.splice(0, 7),
    calledUno: false,
  }));

  const res = cardsHelper.parseCard({
    playedCard: pile[0],
  });

  if (!res.success) return;

  const game: Game = {
    players,
    currPlayerIndex: 0,

    deck,
    pile,
    direction: 1,

    topCard: res.data,

    currEffect: null,
    nextEffect: null,
    currDrawStack: 0,
  };

  games.set(room.id, game);
};

// ok
const createTurn = (
  roomId: string,
  currentPlayerId: string,
  effect: CardEffect
) => {
  const turn = {
    startTime: new Date().getTime(),
    effect,

    currentPlayerId,

    cardPut: false,
    cardDraw: false,
  };

  turns.set(roomId, turn);

  return turn;
};

// ok
const getState = (game: Game): GameState => ({
  players: game.players.map((p) => {
    const { hand, ...rest } = p;

    return {
      ...rest,
      numCards: hand.length,
    };
  }),

  direction: game.direction,
  topCard: game.topCard,
  currDrawStack: game.currDrawStack,
});

// ok
const getHand = (game: Game, id: string) => {
  const player = game.players.find((p) => p.id === id);

  return {
    hand: player?.hand ?? [],
    calledUno: player?.calledUno ?? false,
  };
};

// ok
const autoDraw = (game: Game) => {
  let cardsToDraw = 1;

  if (game.currEffect) {
    cardsToDraw = game.currDrawStack;
    game.currDrawStack = 0;
  }

  cardsHelper.draw(
    game.players[game.currPlayerIndex],
    cardsToDraw,
    game.deck,
    game.pile
  );
};

// ok
const advanceTurn = (game: Game) => {
  game.currEffect = game.nextEffect;
  game.nextEffect = null;
  game.currPlayerIndex = getNextPlayerIndex(game);
};

// ok
const skipTurn = (game: Game) => {
  const effect = game.currEffect;

  if (effect !== "SKIP") {
    cardsHelper.draw(
      game.players[game.currPlayerIndex],
      game.currDrawStack,
      game.deck,
      game.pile
    );

    game.currDrawStack = 0;
  }

  game.currPlayerIndex = getNextPlayerIndex(game);
  game.currEffect = null;
  game.nextEffect = null;
};

// ok
const applyEffect = (game: Game, type: CardType) => {
  switch (type) {
    case "SKIP":
      game.nextEffect = type;
      break;
    case "REVERSE":
      if (game.players.length === 2)
        game.nextEffect = "SKIP";
      else game.direction = game.direction === 1 ? -1 : 1;
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

// ok
const cleanUp = (roomId: string) => {
  const timer = timers.get(roomId);
  if (timer) clearTimeout(timer);

  timers.delete(roomId);
  turns.delete(roomId);
  games.delete(roomId);
};

const leave = (
  game: Game,
  playerId: string
): LeaveGameRes | null => {
  const find = (p: PlayerSlot) => p.id === playerId;
  const filter = (p: PlayerSlot) => p.id !== playerId;

  const playerIndex = game.players.findIndex(find);
  if (playerIndex === -1) return null;

  if (game.players.length === 2) {
    const winner = game.players.find(filter);
    if (!winner) return null;

    return { type: "WON", id: winner.id };
  }

  const newIndex = adjustPlayerIndex(
    game.currPlayerIndex,
    playerIndex,
    game.players.length - 1,
    game.direction
  );

  game.currEffect = null;
  game.nextEffect = null;
  game.currDrawStack = 0;

  game.deck.push(...game.players[playerIndex].hand);
  game.players = game.players.splice(playerIndex, 1);
  game.currPlayerIndex = newIndex;

  const wasPlaying = playerIndex === game.currPlayerIndex;

  return { type: "LEFT", wasPlaying };
};

export default {
  createGame,
  createTurn,
  getHand,
  getState,
  autoDraw,
  applyEffect,
  skipTurn,
  advanceTurn,
  leave,
  cleanUp,
};
