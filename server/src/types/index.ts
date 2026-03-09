/* CARDS */

export type CardNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CardColor = "R" | "Y" | "G" | "B";

export type Card = `${CardNumber | "S" | "R" | "T"}${CardColor}` | "FC" | "WC"; 

export type CardType = "NUMBER" | "SKIP" | "REVERSE" | "DRAW_TWO" | "DRAW_FOUR" | "WILD_CARD"; 
export type CardEffect = "SKIP" | "DRAW_TWO" | "DRAW_FOUR" | null; 

export type NumberCard    = { raw: Card; type: "NUMBER";    color: CardColor; number: number; }; 
export type SkipCard      = { raw: Card; type: "SKIP";      color: CardColor; }; 
export type ReverseCard   = { raw: Card; type: "REVERSE";   color: CardColor; }; 
export type DrawTwoCard   = { raw: Card; type: "DRAW_TWO";  color: CardColor; }; 
export type DrawFourCard  = { raw: "FC"; type: "DRAW_FOUR"; color: CardColor; }; 
export type WildCard      = { raw: "WC"; type: "WILD_CARD"; color: CardColor; }; 

export type ParsedCard = NumberCard | SkipCard | ReverseCard | DrawTwoCard | WildCard | DrawFourCard;

/* PLAYERS */

export interface PlayerSlot { 
  id: string;
  name: string;
  pos: number;
  color: string;
};

export interface PlayerState extends PlayerSlot { 
  hand: Card[]; 
  calledUno: boolean;
};

export interface PlayerInfo extends PlayerSlot { 
  numCards: number;
};

/* ROOMS */

export interface RoomRules {
  mirror: boolean;
  stair: boolean;
  stack: boolean;
}

export interface Room { 
  id: string, 
  name: string, 
  turnDuration: "30" | "60" | "90"; 
  capacity: "2" | "3" | "4"; 
  state: "WAITING" | "FULL" | "PLAYING"; 

  adminId: string; 

  players: PlayerSlot[];

  rules: RoomRules; 
}; 

export type CreateRoomProps = Omit<Room, "id" | "adminId" | "players" | "state" > 

export type LeaveRoomRes = { type: "ROOM_DELETED"; roomId: string } | { type: "ROOM_LEFT"; room: Room };

/* GAME */

type Direction = 1 | -1; 

export interface Game { 
  players: PlayerState[]; 
  currentPlayerIndex: number; 
  direction: Direction; 

  deck: Card[]; 
  pile: Card[]; 
  topCard: ParsedCard; 

  currentEffect: CardEffect; 
  nextEffect: CardEffect;

  currentDrawStack: number; 
}; 

export interface GameState {
  players: PlayerInfo[]; 

  direction: Direction; 
  topCard: ParsedCard;
  currentDrawStack: number; 
};

export interface Turn { 
  startTime: Date | null;

  currentPlayerId: string; 
  effect: CardEffect,
 
  cardPut: boolean; 
  cardDraw: boolean; 
}; 

export type LeaveGameRes = 
  | { type: "GAME_EMPTY" }
  | {
      type: "GAME_WON";
      winnerId: string;
    }
  | {
      type: "LEFT_GAME";
      wasCurrentPlayer: boolean;
    };

/* SOCKET RESPONSE */

export interface RoomId {
  roomId: string;
}

export interface UserName {
  name: string;
}

export interface AvailableRooms {
  availableRooms: Room[];
}

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export type SocketRes<T> =
  | SuccessResponse<T>
  | ErrorResponse;

/* CHAT */

export interface Message { 
  date: Date; 
  playerId: string;
  userName: string; 
  color: string; 
  message: string;
};