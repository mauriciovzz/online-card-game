import { Server, Socket } from "socket.io";

import { rooms } from "@/stores";
import { emitMessage, emitError } from "@/utils/emiterHelper";

import { Message } from "@/types";

export const chatSocket = (io: Server, socket: Socket) => {

  socket.on("chat:sendMessage", ({ content }: { content: string }) => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId);
    
    if (!room) {
      emitError(socket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    const player = room.players.find((p) => p.id === socket.id);

    if (player) {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        senderId: socket.id,
        senderName: player.name,
        content,
        createdAt: new Date().getTime(),
      };
    
      emitMessage(io, roomId, newMessage);
    };
  });
 
  socket.on("chat:typing:start", () => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId);
    
    if (!room) {
      emitError(socket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    const player = room.players.find((p) => p.id === socket.id);

    if (player) {    
      socket.to(roomId).emit("chat:typing:start", {
        success: true,
        error: null,
        data: { userId: socket.id} ,
      });
    };
  });
 
  socket.on("chat:typing:stop", () => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId);
    
    if (!room) {
      emitError(socket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    const player = room.players.find((p) => p.id === socket.id);

    if (player) {    
      socket.to(roomId).emit("chat:typing:stop", {
        success: true,
        error: null,
        data: { userId: socket.id} ,
      });
    };
  });

  socket.on("chat:read", ({ lastReadCreatedAt }) => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId);
    
    if (!room) {
      emitError(socket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    socket.to(roomId).emit("chat:readUpdate", {
        success: true,
        error: null,
        data: {
          playerId: socket.id,
          lastReadCreatedAt,
        } ,
      });
  });

};
