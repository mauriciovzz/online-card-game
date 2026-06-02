import {
  RoomId,
  RoomCapacity,
  Room,
  AvailableRooms,
  CreateRoomProps,
  RoomInfo,
  PlayerId,
  EmptyResponse,
  WinnerInfo,
} from "@shared/types";
import { SocketCallback } from ".";

interface RoomError {
  error: string;
}

export interface RoomClientEvents {
  "room:create": (
    payload: CreateRoomProps,
    callback: SocketCallback<RoomId>
  ) => void;

  "room:getAvailable": (
    callback: SocketCallback<AvailableRooms>
  ) => void;

  "room:join": (
    payload: RoomId,
    callback: SocketCallback<RoomId>
  ) => void;

  "room:getData": (callback: SocketCallback<Room>) => void;

  "room:update": (
    payload: RoomInfo,
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:updateCapacity": (
    payload: { capacity: RoomCapacity },
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:kickPlayer": (
    payload: PlayerId,
    callback: SocketCallback<EmptyResponse>
  ) => void;

  "room:leave": (payload: RoomId) => void;

  "room:startGame": (
    callback: SocketCallback<RoomId>
  ) => void;
}

export interface RoomServerEvents {
  "room:availableRooms": (data: AvailableRooms) => void;

  "room:currentData": (newData: Room) => void;

  "room:gameStarted": (data: RoomId) => void;

  "room:gameEnded": (data: WinnerInfo) => void;

  "room:kickedOut": (data: EmptyResponse) => void;

  "room:error": (data: RoomError) => void;
}
