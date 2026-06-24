import type { ErrorCode } from "@shared/constants/errorCodes";

/* CARDS */

export type CardColor = 
  | "R"
  | "Y"
  | "G"
  | "B"
  | "W";

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

interface CardInfo {
  id: string
  raw: string;
  color: CardColor;
}

export interface RegularCard extends CardInfo {
  type: "SKIP" | "REVERSE" | "DRAW_TWO" | "DRAW_FOUR" | "WILD_CARD";
}

export interface NumberCard extends CardInfo {
  type: "NUMBER";
  number: number;
}

export type Card = RegularCard | NumberCard;

export interface PlayedCard {
  cardId: string;
  chosenColor?: CardColor;
}

/* PLAYERS */
export type PlayerPos = 1 | 2 | 3 | 4;

export type PlayerType = "human"  | "ai";

export interface Player {
  id: string;
  type: PlayerType
  pos: PlayerPos;
  name: string;
  joinedAt: number;
}

export interface HandState {
  cards: Card[];
  calledUno: boolean;
}

export type PlayerState = Player & HandState;

export interface OpponentState extends Player {
  numCards: number;
  calledUno: boolean;
}

/* ROOMS */

export type TurnDuration = "15" | "30" | "45";

export interface RoomRules {
  mirror: boolean;
  stair: boolean;
  stack: boolean;
}

export interface RoomSeat {
  pos: PlayerPos;
  type?: PlayerType;
}

export interface RoomInfo {
  name: string;
  turnDuration: TurnDuration;
  rules: RoomRules;
}

export interface Room extends RoomInfo {
  id: string;
  state: "WAITING" | "FULL" | "PLAYING";
  adminId: string;

  seats: RoomSeat[];
  players: Player[];
}

export interface CreateRoomProps extends RoomInfo {
  seats: RoomSeat[]
}

/* GAME */

export type Direction = 1 | -1;

export interface Game {
  players: PlayerState[];
  currPlayerIndex: number;

  direction: Direction;

  deck: Card[];
  pile: Card[];
  topCard: Card;

  currEffect: CardEffect;
  currDrawStack: number;
  nextEffect: CardEffect;
}

export interface GameState {
  players: OpponentState[];

  direction: Direction;
  topCard: Card;

  currDrawStack: number;
}

export interface Turn {
  startTime: number;
  expiresAt: number;
  effect: CardEffect;

  currentPlayerId: string;

  cardPut: boolean;
  cardDraw: boolean;
}

/* CHAT */

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: number;
}

export interface Typer {
  userId: string;
}

export interface MessageCheck {
  playerId: string;
  isRead: boolean;
}

/* RESPONSE TYPES */

export interface PlayerId {
  playerId: string;
}

export interface TimeoutRes {
  hadToDraw: boolean;
}

export interface LastRead {
  lastReadCreatedAt: number;
}

export interface ReadUpdate extends PlayerId {
  lastReadCreatedAt: number;
}

export interface UserName {
  name: string;
}

export interface RoomId {
  roomId: string;
}

export interface AvailableRooms {
  availableRooms: Room[];
}

export interface NotificationInfo {
  id?: string;
  name: string;
  pos: PlayerPos;
}

export interface CutInfo {
  cuttedId: string;
  cuttedName: string;
  cuttedPos: number;
  cutterName: string;
  cutterPos: number;
}

export interface WinnerInfo {
  winner?: NotificationInfo;
  playerThatLeft?: string;
}

interface SkipInfo {
  type: "SKIP";
  pos: PlayerPos;
}

interface DrawInfo {
  type: "DRAW";
  pos: PlayerPos;
  cards: number;
}

export type EffectInfo = SkipInfo | DrawInfo;

export interface InitialGameData {
  gameState: GameState;
  cards: Card[];
}

export interface PlayerQuit {
  name: string;
  gameState: GameState;
}

export type EmptyResponse = null;

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: ErrorCode;
}

export type SocketRes<T> =
  | SuccessResponse<T>
  | ErrorResponse;
