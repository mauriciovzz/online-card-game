/* SOCKETS */
import { Server, Socket } from "socket.io";

import { UserEvents, UserResponses } from "./user.types";
import { RoomEvents, RoomResponses } from "./room.types";
import { ChatEvents, ChatResponses } from "./chat.types";
import { GameEvents, GameResponses } from "./game.types";

export type ClientToServerEvents = UserEvents &
  RoomEvents &
  ChatEvents &
  GameEvents;

export type ServerToClientEvents = UserResponses &
  RoomResponses &
  ChatResponses &
  GameResponses;

export type InterServerEvents = object;

export interface SocketData {
  roomId: string | undefined;
}

export type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

/* CARDS */

export type CardNumber =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9;

export type CardColor = "R" | "Y" | "G" | "B";

export type Card =
  | `${CardNumber | "S" | "R" | "T"}${CardColor}`
  | "FC"
  | "WC";

export type CardType =
  | "NUMBER"
  | "SKIP"
  | "REVERSE"
  | "DRAW_TWO"
  | "DRAW_FOUR"
  | "WILD_CARD";

export type CardEffect =
  | "SKIP"
  | "DRAW_TWO"
  | "DRAW_FOUR"
  | null;

export interface NumberCard {
  raw: Card;
  type: "NUMBER";
  color: CardColor;
  number: number;
}

export interface SkipCard {
  raw: Card;
  type: "SKIP";
  color: CardColor;
}

export interface ReverseCard {
  raw: Card;
  type: "REVERSE";
  color: CardColor;
}

export interface DrawTwoCard {
  raw: Card;
  type: "DRAW_TWO";
  color: CardColor;
}

export interface DrawFourCard {
  raw: "FC";
  type: "DRAW_FOUR";
  color: CardColor;
}

export interface WildCard {
  raw: "WC";
  type: "WILD_CARD";
  color: CardColor;
}

export type ParsedCard =
  | NumberCard
  | SkipCard
  | ReverseCard
  | DrawTwoCard
  | WildCard
  | DrawFourCard;

export interface PlayedCard {
  playedCard: string;
  chosenColor?: string;
}

/* PLAYERS */

export interface PlayerSlot {
  id: string;
  name: string;
  pos: number;
  joinedAt: number;
}

export interface PlayerHand {
  hand: Card[];
  calledUno: boolean;
}

export type PlayerState = PlayerSlot & PlayerHand;

export interface PlayerInfo extends PlayerSlot {
  numCards: number;
  calledUno: boolean;
}

/* ROOMS */

export interface RoomRules {
  mirror: boolean;
  stair: boolean;
  stack: boolean;
}

export type RoomCapacity = "2" | "3" | "4";

export interface Room {
  id: string;
  name: string;
  turnDuration: "30" | "60" | "90";
  capacity: RoomCapacity;
  state: "WAITING" | "FULL" | "PLAYING";

  adminId: string;

  players: PlayerSlot[];

  rules: RoomRules;
}

export type CreateRoomProps = Omit<
  Room,
  "id" | "adminId" | "players" | "state"
>;

export type UpdateRoomProps = Omit<
  CreateRoomProps,
  "capacity"
>;

/* GAME */

type Direction = 1 | -1;

export interface Game {
  players: PlayerState[];
  currPlayerIndex: number;
  direction: Direction;

  deck: Card[];
  pile: Card[];
  topCard: ParsedCard;

  currEffect: CardEffect;
  currDrawStack: number;
  nextEffect: CardEffect;
}

export interface GameState {
  players: PlayerInfo[];

  direction: Direction;
  topCard: ParsedCard;
  currDrawStack: number;
}

export interface Turn {
  startTime: number;
  effect: CardEffect;

  currentPlayerId: string;

  cardPut: boolean;
  cardDraw: boolean;
}

export type LeaveGameRes =
  | {
      type: "WON";
      id: string;
    }
  | {
      type: "LEFT";
      wasPlaying: boolean;
    };

/* SOCKET RESPONSE */

export interface RoomId {
  roomId: string;
}

export interface PlayerId {
  playerId: string;
}

export interface UserName {
  name: string;
}

export interface AvailableRooms {
  availableRooms: Room[];
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type SocketRes<T> =
  | SuccessResponse<T>
  | ErrorResponse;

export type SocketCallback<T> = (res: SocketRes<T>) => void;

/* CHAT */

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: number;
}
