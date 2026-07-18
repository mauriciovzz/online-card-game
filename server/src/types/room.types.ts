import {
  RoomId,
  Room,
  AvailableRooms,
  CreateRoomProps,
  RoomInfo,
  EmptyResponse,
  FinishedGameInfo,
  RoomSeat,
  PlayerPos,
} from "@shared/types";
import { SocketCallback } from ".";

interface RoomError {
  error: string;
}

export interface RoomClientEvents {
  "room:getAvailable": (
    callback: SocketCallback<AvailableRooms>
  ) => void;

  "room:create": (
    payload: CreateRoomProps,
    callback: SocketCallback<RoomId>
  ) => void;

  "room:join": (
    payload: RoomId,
    callback: SocketCallback<RoomId>
  ) => void;

  "room:getData": (
    payload: RoomId,
    callback: SocketCallback<Room>
  ) => void;

  "room:update": (
    payload: RoomInfo,
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:openSeat": (
    payload: RoomSeat,
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:closeSeat": (
    payload: { pos: PlayerPos },
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:kickPlayer": (
    payload: { pos: PlayerPos },
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:resetScores": (
    callback: SocketCallback<Room>
  ) => void;

  "room:startGame": (
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:stopGame": (
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:leave": (payload: RoomId) => void;
}

export interface RoomServerEvents {
  "room:availableRooms": (data: AvailableRooms) => void;

  "room:currentData": (newData: Room) => void;

  "room:scoresReset": (newData: Room) => void;

  "room:gameStarted": (data: EmptyResponse) => void;

  "room:gameEnded": (data: FinishedGameInfo) => void;

  "room:kickedOut": (data: EmptyResponse) => void;

  "room:error": (data: RoomError) => void;
}
