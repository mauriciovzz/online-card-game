import { Socket } from "socket.io";

import { rooms } from "@/stores";
import { emitError } from "@/utils/emiterHelper";

import { ErrorResponse, PlayerSlot, Room } from "@/types";

const ERROR_MAP: Record<number, string> = {
  1: "ROOM_NOT_FOUND",
  2: "PLAYER_NOT_FOUND",
  3: "NOT_ADMIN",
};

export const getRoom = (
  socket: Socket, 
  roomId?: string,
  callback?: (res: ErrorResponse) => void
): Room | null => {
  const id = roomId ?? socket.data.roomId;
  const room = rooms.get(id);

  if (!room) {
    if (callback) {
      callback({ success: false, error: ERROR_MAP[1] })
    } else {
      emitError(socket, "room:error", ERROR_MAP[1]);
    }
    return null;
  }

  return room;
};

export const isPlayerInRoom = (
  socket: Socket, 
  room: Room,
  callback?: (res: ErrorResponse) => void
): PlayerSlot | null => {
  const player = room.players.find((p) => p.id === socket.id);

  if (!player) {
    if (callback) {
      callback({ success: false, error: ERROR_MAP[2] })
    } else {
      emitError(socket, "room:error", ERROR_MAP[2]);
    }
    return null;
  }

  return player;
}

export const isPlayerAdmin = (
  socket: Socket, 
  room: Room,
  callback: (res: ErrorResponse) => void
) => {
  const isAdmin = socket.id === room.adminId;

  if (!isAdmin) {
    callback({ success: false, error: ERROR_MAP[3] })
    return false;
  }

  return true;
}
