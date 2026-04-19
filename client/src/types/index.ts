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
  joinedAt: number;
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
  players: PlayerSlot[];
}

export type CreateRoomProps = Omit<
  Room,
  "id" | "adminId" | "players" | "state"
>;

export type UpdateRoomProps = Omit<
  CreateRoomProps,
  "capacity"
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

export type View = "lobby" | "edit";

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
