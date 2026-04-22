import { Socket } from "socket.io";

import { rooms } from "@/stores";
import { emitError } from "@/utils/emiterHelper";

import { ErrorResponse, Room } from "@/types";

export const checkRoom = ({
  socket,
  roomId,
  handler
} : {
  socket: Socket;
  roomId?: string;
  handler: (roon:Room) => void;
}) => {
  const finalRoomId = roomId ? roomId : socket.data.roomId;
  const room = rooms.get(finalRoomId);

  if (!room) {
    emitError(socket, "room:error", "ROOM_NOT_FOUND");
    return;
  }

  handler(room);
}

export const ensurePlayerInRoom = ({socket, room, callback, handler} : {
  socket: Socket,
  room: Room,
  callback: (res: ErrorResponse) => void
  handler: () => void,
}) => {
  const isInRoom = room.players.some((p) => p.id === socket.id);

  if (!isInRoom) {
    callback({
      success: false,
      error: "PLAYER_NOT_FOUND"
    })
    return;
  }

  handler();
}
