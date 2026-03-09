import { Server, Socket } from "socket.io";
import { CreateRoomProps } from "@/types";
import { users, rooms } from "@/stores";
import { roomService } from "@/services";
import gameLoop from "@/loop/gameLoop";
import logger from "@/utils/logger";
import { emitRoomInfo, emitError, broadcastRoomList, emit } from "@/utils/emiterHelper";

export const roomSocket = (io: Server, socket: Socket) => {

  socket.on("room:create", (payload: CreateRoomProps) => {
    const roomId = roomService.create(socket, payload);
  
    broadcastRoomList(io, roomService.getAvailable()); 
    emit(socket, "room:created", { roomId });

    logger.roomLog(roomId, 'room created.');
    logger.roomLog(roomId, `${users.get(socket.id)} [${socket.id}] joined the room.`);
  });

  socket.on("room:getAvailable", () => {
    emit(socket, "room:newList", roomService.getAvailable());
  });

  socket.on("room:getInfo", () => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId)

    if (!room) {
      emitError(socket, "room:newInfo", "ROOM_NOT_FOUND");
      return;
    };

    emit(socket, "room:newInfo", room);
  });

  socket.on("room:join", ({ roomId }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      emitError(socket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    if (room.state === "FULL") {
      emitError(socket, "room:joined", "ROOM_IS_FULL");
      return;
    };  

    roomService.join(socket, room);
    emit(socket, "room:joined", { roomId});

    broadcastRoomList(io, roomService.getAvailable());
    emitRoomInfo(io, room);

    logger.roomLog(roomId, `${users.get(socket.id)} [${socket.id}] joined the room.`);
  });

  socket.on("room:leave", ({ roomId }) => {
    const room = rooms.get(roomId);

    if (!room) {
      emitError(socket, "room:left", "ROOM_NOT_FOUND");
      return; 
    };

    const isInRoom = room.players.some((p) => p.id === socket.id);

    if (!isInRoom) {
      emitError(socket, "room:left", "NOT_IN_ROOM");
      return; 
    };

    gameLoop.handlePlayerExit(
      io,
      socket,
      roomId,
      "LEAVE_ROOM",
    );
  });

};
