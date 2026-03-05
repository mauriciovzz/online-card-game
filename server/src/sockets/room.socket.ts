import { Server, Socket } from "socket.io";
import { CreateRoomProps } from "@/types";
import { users, rooms } from "@/stores";
import { roomService } from "@/services";
import gameLoop from "@/loop/gameLoop";
import logger from "@/utils/logger";
import { emitRoomError } from "@/utils/emiterHelper";

export const roomSocket = (io: Server, socket: Socket) => {

  socket.on("room:create", (payload: CreateRoomProps) => {
    const roomId = roomService.create(socket, payload);
  
    io.emit("room:list", roomService.getAvailable());
    socket.emit("room:created", { roomId });

    logger.roomLog(roomId, 'room created.');
    logger.roomLog(roomId, `${users.get(socket.id)} [${socket.id}] joined the room.`);
  });

  socket.on("room:getAvailable", () => {
    socket.emit("room:list", roomService.getAvailable());
  });

  socket.on("room:getInfo", ({ roomId }) => {
    const room = rooms.get(roomId)

    if (!room) {
      emitRoomError(socket, "room:info", "ROOM_NOT_FOUND");
      return;
    };

    socket.emit("room:info", {
      success: true,
      error: null,
      data: { room },
    });
  });

  socket.on("room:join", ({ roomId }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      emitRoomError(socket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    if (room.state === "FULL") {
      emitRoomError(socket, "room:joined", "ROOM_IS_FULL");
      return;
    };  

    roomService.join(socket, room);

    socket.emit("room:joined", {
      success: true,
      error: null,
      data: { roomId },
    });

    io.emit("room:list", roomService.getAvailable());
    io.to(roomId).emit("room:updatedInfo", room);
  
    logger.message(`[${roomId}]: ${users.get(socket.id)} [${socket.id}] joined the room.`);
  });

  socket.on("room:leave", ({ roomId }) => {
    const room = rooms.get(roomId);

    if (!room) {
      emitRoomError(socket, "room:left", "ROOM_NOT_FOUND");
      return; 
    };

    const isInRoom = room.players.some((p) => p.id === socket.id);

    if (!isInRoom) {
      emitRoomError(socket, "room:left", "NOT_IN_ROOM");
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
