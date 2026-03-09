import { rooms } from "@/stores";
import { Message } from "@/types";
import { emitMessage, emitError } from "@/utils/emiterHelper";
import { Server, Socket } from "socket.io";

export const chatSocket = (io: Server, socket: Socket) => {

  socket.on("chat:sendMessage", ({ message }: { message: string }) => {
    const roomId = socket.data.roomId;
    const room = rooms.get(roomId);
    
    if (!room) {
      emitError(socket, "room:joined", "ROOM_NOT_FOUND");
      return;
    };

    const player = room.players.find((p) => p.id === socket.id);

    if (player) {
      const newMessage: Message = {
        date: new Date(),
        playerId: socket.id,
        userName: player.name,
        color: player.color,
        message,
      };
    
      emitMessage(io, roomId, newMessage);
    };
  });
 
};
