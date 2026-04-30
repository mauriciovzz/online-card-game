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

export type CardLetter =
  | "S"
  | "R"
  | "T";

export type CardValue = CardNumber | CardLetter;

export type CardColor = 
  | "R"
  | "Y"
  | "G"
  | "B";

export type Card =
  | `${CardValue}${CardColor}`
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
  number: CardNumber;
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

export interface Player {
  id: string;
  pos: number;
  name: string;
  joinedAt: number;
}

export interface PlayerHand {
  hand: Card[];
  calledUno: boolean;
}

export type PlayerState = Player & PlayerHand;

export interface OponnetState extends Player {
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

export interface RoomInfo {
  name: string;
  turnDuration: "30" | "60" | "90";
  rules: RoomRules;
}

export interface Room extends RoomInfo {
  id: string;
  state: "WAITING" | "FULL" | "PLAYING";

  adminId: string;
  capacity: RoomCapacity;
  players: Player[];
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
  players: OponnetState[];

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

export interface ReadUpdate {
  playerId: string;
  lastReadCreatedAt: number;
}

/* RESPONSE TYPES */

export interface PlayerId {
  playerId: string;
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

export interface InitialGameData extends PlayerHand {
  gameState: GameState;
}

export interface PlayerQuitProps {
  playerName: string;
  gameState: GameState;
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
