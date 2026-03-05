import { Room, PlayerState, Game, CardEffect, CardType, GameState, LeaveGameRes, Card } from "@/types";
import { games, timers, turns } from "@/stores/games.store";
import deckHelper from "@/utils/deckHelper";
import { Socket } from "socket.io";

const getNextPlayerIndex = (game: Game) => {
  const { currentPlayerIndex, direction,  players } = game;

  const numPlayers = players.length;
  return (currentPlayerIndex + direction + numPlayers) % numPlayers;
};

// main functions ---

const createGame = (roomId: string, room: Room) => {
  const { deck, pile } = deckHelper.create();
  
  const players: PlayerState[] = room.players.map((p) => ({
    ...p, 
    hand: deck.splice(0,7),
    calledUno: false,
  }));

  const game: Game = {
    players,
    currentPlayerIndex: 0,

    deck,
    pile,
    direction: 1,

    topCard: deckHelper.parseCard(pile[0] as Card),

    currentEffect: null,
    nextEffect: null,
    currentDrawStack: 0,
  };

  games.set(roomId, game);
};

const createTurn = ( roomId: string, userId: string, effect: CardEffect) => {
  const turn = {
    startTime: new Date(),

    currentPlayerId: userId,
    effect,

    cardPut: false,
    cardDraw: false,
  };

  turns.set(roomId, turn);

  return turn;
};

const getState = (game: Game): GameState => ({ 
  players: game.players.map((p) => {
    const { hand, calledUno, ...rest} = p;

    return {
      ...rest,
      numCards: hand.length,
    };
  }),

  direction: game.direction,
  topCard: game.topCard,
  currentDrawStack: game.currentDrawStack,
});

const getPlayerHand = (game: Game, playerId: string) => {
  return game.players.find((p) => p.id === playerId)?.hand || [];
};

const applyEffect = (game: Game, type: CardType) => {
  switch (type) {
    case "SKIP":
      game.nextEffect = type;
      break;
    case "REVERSE":
      if (game.players.length === 2) 
        game.nextEffect = "SKIP";
      else
        game.direction = game.direction === 1 ? -1 : 1;
      break;
    case "DRAW_TWO":            
      game.nextEffect = type;
      game.currentDrawStack += 2;
      break;
    case "DRAW_FOUR":
      game.nextEffect = type;
      game.currentDrawStack += 4;
      break;
  };
};

const skipTurn = (game: Game) => { 
  const effect = game.currentEffect;

  if (effect !== "SKIP") { 
    const cardsToDraw = game.currentDrawStack > 0
      ? game.currentDrawStack
      : effect === "DRAW_TWO" ? 2 : 4;

    const { players, currentPlayerIndex, deck, pile } = game;

    deckHelper.draw(
      players[currentPlayerIndex],
      deck,
      pile, 
      cardsToDraw,
    );

    game.currentDrawStack = 0;
  };

  game.currentPlayerIndex = getNextPlayerIndex(game);
  game.currentEffect = null;
  game.nextEffect = null;
};

const advanceTurn = (game: Game) => {
  game.currentEffect = game.nextEffect;
  game.nextEffect = null;

  game.currentPlayerIndex = getNextPlayerIndex(game);
};

const cleanUp = (roomId: string) => {
  const timer = timers.get(roomId);
  if (timer) clearTimeout(timer);

  timers.delete(roomId);      
  turns.delete(roomId);
  games.delete(roomId);
};

const leave = (socket: Socket, game: Game): LeaveGameRes | null => {
  const leavingIndex = game.players.findIndex(p => p.id === socket.id);
  if (leavingIndex === -1) return null;  
  
  if (game.players.length === 2) {
    const winner = game.players.find((p) => p.id !== socket.id);
    if (!winner) return null;
 
    return { 
      type: "GAME_WON", 
      winnerId: winner.id,
    };
  };
  
  const wasCurrentPlayer = leavingIndex === game.currentPlayerIndex;

  const numPlayers = game.players.length;
  const direction = game.direction;
  let newPlayerIndex = game.currentPlayerIndex;

  if (wasCurrentPlayer) {
    if (direction === 1) {
      if (newPlayerIndex + 1 === numPlayers)
        newPlayerIndex = 0;
    } else {
      if (newPlayerIndex === 0) {
        newPlayerIndex = numPlayers - 1;
      } else {
        newPlayerIndex -= 1 ;
      };
    };

    game.currentEffect = null;
    game.nextEffect = null;
    game.currentDrawStack = 0;

  } else {
    if (leavingIndex < newPlayerIndex) {
      newPlayerIndex -= 1;
    }
  };

  game.deck.push(...game.players[leavingIndex].hand);
  game.players = game.players.splice(leavingIndex, 1);
  game.currentPlayerIndex = newPlayerIndex;

  return { 
    type: "LEFT_GAME",
    wasCurrentPlayer,
  };
};

export default { 
  createGame,
  createTurn,
  getState,
  getPlayerHand,
  applyEffect,
  skipTurn,
  advanceTurn,
  leave,
  cleanUp,
};