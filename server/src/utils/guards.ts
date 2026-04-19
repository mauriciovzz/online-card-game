import { Socket } from "socket.io";

import { rooms } from "@/stores";
import { emitError } from "@/utils/emiterHelper";

import { Room } from "@/types";

export const checkRoom = (
  socket: Socket, 
  handler: (roon:Room) => void,
) => {
  const roomId = socket.data.roomId;
  const room = rooms.get(roomId);

  if (!room) {
    emitError(socket, "room:error", "ROOM_NOT_FOUND");
    return;
  }

  handler(room);
}

export function getRoomByIdOrFail(
  socket: Socket,
  event: string,
  roomId: string
): Room | null {
  const room = rooms.get(roomId);

  if (!room) {
    emitError(socket, event, "ROOM_NOT_FOUND");
    return null;
  }

  return room;
}

export function ensurePlayerInRoom(
  socket: Socket,
  room: Room,
  event: string
): boolean {
  const isInRoom = room.players.some((p) => p.id === socket.id);

  if (!isInRoom) {
    emitError(socket, event, "NOT_IN_ROOM");
    return false;
  }

  return true;
}
