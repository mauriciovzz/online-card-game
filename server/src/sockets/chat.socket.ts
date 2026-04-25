import { Server, Socket } from "socket.io";

import { emitMessage } from "@/utils/emiterHelper";

import { Message } from "@/types";
import { getRoom, isPlayerInRoom } from "@/utils/guards";

export const chatSocket = (io: Server, socket: Socket) => {

  socket.on("chat:sendMessage", ({ content }: { content: string }) => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return; 

    const player = isPlayerInRoom(socket, room, undefined);
    if (!player) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: socket.id,
      senderName: player.name,
      content,
      createdAt: new Date().getTime(),
    };
  
    emitMessage(io, room.id, newMessage);
  });
 
  socket.on("chat:typing:start", () => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return; 

    const player = isPlayerInRoom(socket, room, undefined);
    if (!player) return;

    socket.to(room.id).emit("chat:typing:start", {
      success: true, data: { userId: socket.id}
    });
  });
 
  socket.on("chat:typing:stop", () => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return; 

    const player = isPlayerInRoom(socket, room, undefined);
    if (!player) return;

    socket.to(room.id).emit("chat:typing:stop", {
      success: true, data: { userId: socket.id}
    });
  });

  socket.on("chat:read", ({ lastReadCreatedAt }) => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return; 

    socket.to(room.id).emit("chat:readUpdate", {
      success: true,
      data: { playerId: socket.id, lastReadCreatedAt },
    });
  });

};
