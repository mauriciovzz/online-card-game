import {
  CreateRoomProps,
  SocketCallback,
  RoomId,
  AvailableRooms,
  Room,
  UpdateRoomProps,
  RoomCapacity,
  PlayerId,
} from ".";

interface RoomError {
  error: string;
}

export interface RoomEvents {
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
    payload: UpdateRoomProps,
    callback: SocketCallback<null>
  ) => void;

  "room:updateCapacity": (
    payload: { capacity: RoomCapacity },
    callback: SocketCallback<null>
  ) => void;

  "room:kickPlayer": (
    payload: PlayerId,
    callback: SocketCallback<null>
  ) => void;

  "room:leave": (payload: RoomId) => void;

  "room:startGame": (
    callback: SocketCallback<RoomId>
  ) => void;
}

export interface RoomResponses {
  "room:availableRooms": (data: AvailableRooms) => void;

  "room:currentData": (newData: Room) => void;

  "room:gameStarted": (data: RoomId) => void;

  "room:kickedOut": () => void;

  "room:error": (data: RoomError) => void;
}
