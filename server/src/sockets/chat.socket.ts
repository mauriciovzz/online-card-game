import { Server, Socket } from "socket.io";

export const chatSocket = (io: Server, socket: Socket) => {

  socket.on("chat:sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("chat:newMessage", {
      playerId: socket.id,
      date: new Date(),
      message,
    });
  });
 
};
