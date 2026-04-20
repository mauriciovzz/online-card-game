import { Server, Socket } from "socket.io";

import { users, rooms } from "@/stores";
import { roomService } from "@/services";
import gameLoop from "@/loop/gameLoop";
import logger from "@/utils/logger";
import { checkRoom } from "@/utils/guards"
import { emitError, broadcastRoomList, emit, syncRoom } from "@/utils/emiterHelper";

import { CreateRoomProps, UpdateRoomProps } from "@/types";

export const roomSocket = (io: Server, socket: Socket) => {

  socket.on("room:create", (payload: CreateRoomProps) => {
    const roomId = roomService.create(socket, payload);
  
    emit(socket, "room:created", { roomId });
    broadcastRoomList(io, roomService.getAvailable());
  });

  socket.on("room:getAvailable", () => {
    emit(socket, "room:newList", roomService.getAvailable());
  });

  socket.on("room:getInfo", () => {
    checkRoom(socket, (room) => {
      emit(socket, "room:newInfo", room);
    });
  });

  socket.on("room:join", ({ roomId }) => {
    checkRoom(socket, (room) => {
      if (room.state === "FULL") {
        emitError(socket, "room:joined", "ROOM_IS_FULL");
        return;
      };  

      roomService.join(socket, room);
      emit(socket, "room:joined", { roomId});

      syncRoom(io, room, roomService.getAvailable());

      logger.roomLog(roomId, `${users.get(socket.id)} [${socket.id}] joined the room.`);      
    });
  });

  socket.on("room:update", (newData: UpdateRoomProps) => {
    checkRoom(socket, (room) => {
      room.name = newData.name;
      room.turnDuration = newData.turnDuration;
      room.rules = newData.rules;

      syncRoom(io, room, roomService.getAvailable());
    });
  });

  socket.on("room:kickPlayer", ({ playerId }: { playerId: string }) => {
    const kickedSocket = io.sockets.sockets.get(playerId);
    if (!kickedSocket) return;

    const roomId = kickedSocket.data.roomId;
    const room = rooms.get(roomId);

    if (!room) {
      emitError(kickedSocket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    const isInRoom = room.players.some((p) => p.id === kickedSocket.id);

    if (!isInRoom) {
      emitError(kickedSocket, "room:left", "NOT_IN_ROOM");
      return; 
    };

    gameLoop.handlePlayerExit(
      io,
      kickedSocket,
      roomId,
      "KICKED_ROOM",
    );

    kickedSocket.emit("room:leave");
  });

  socket.on("room:updateCapacity", ({ capacity }) => {
    checkRoom(socket, (room) => {
      room.capacity = capacity;
      syncRoom(io, room, roomService.getAvailable());    
    });
  });

  socket.on("room:leave", ({ roomId }) => {
    checkRoom(socket, (room) => {
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
  });

};
