/* SOCKETS */

import { Server, Socket } from "socket.io";
import { SocketRes } from "@shared/types";

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

export type SocketCallback<T> = (res: SocketRes<T>) => void;

/* GAME */

export type LeaveGameRes =
  | {
      type: "WON";
      id: string;
    }
  | {
      type: "LEFT";
      wasPlaying: boolean;
    };
