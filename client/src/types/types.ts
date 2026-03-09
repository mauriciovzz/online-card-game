export interface ShortRoomInfo {
  roomId: string;
  roomName: string;
  roomAdmin: string;
  capacity: 2 | 3 | 4;
  numPlayers: 1 | 2 | 3 | 4;
  rules: {
    useMirror: boolean;
    useStair: boolean;
  };
}

export interface OtherPlayerState {
  id: string;
  numCards: number;
}

export interface GameState {
  cardsInDeck: number;
  pile: string[];
  myCards: string[];
  players: OtherPlayerState[];
}

// NEW

/* PLAYERS */

export interface PlayerSlot {
  id: string;
  name: string;
  pos: number;
  color: string;
}

/* ROOMS */

export interface RoomRules {
  mirror: boolean;
  stair: boolean;
  stack: boolean;
}

export interface Room {
  id: string;
  name: string;
  turnDuration: "30" | "60" | "90";
  capacity: "2" | "3" | "4";
  state: "WAITING" | "FULL" | "PLAYING";

  adminId: string;

  players: PlayerSlot[];

  rules: RoomRules;
}

export type CreateRoom = Omit<
  Room,
  "id" | "adminId" | "players" | "state"
>;

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
}
