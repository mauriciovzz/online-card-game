/* SOCKETS */

import { Server, Socket } from "socket.io";
import { SocketRes } from "@shared/types";

import { UserClientEvents, UserServerEvents } from "./user.types";
import { RoomClientEvents, RoomServerEvents } from "./room.types";
import { ChatClientEvents, ChatServerEvents } from "./chat.types";
import { GameClientEvents, GameServerEvents } from "./game.types";

export type ClientToServerEvents = UserClientEvents &
  RoomClientEvents &
  ChatClientEvents &
  GameClientEvents;

export type ServerToClientEvents = UserServerEvents &
  RoomServerEvents &
  ChatServerEvents &
  GameServerEvents;

export type InterServerEvents = object;

export interface SocketData {
  roomId?: string;
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

export type SocketCallback<T> = (res: SocketRes<T>) => void;
