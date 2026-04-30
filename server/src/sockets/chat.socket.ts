import { getRoom, isPlayerInRoom } from "@/utils/guards";
import { chatService } from "@/services";

import { AppServer, AppSocket } from "@/types";

export const chatSocket = (
  io: AppServer,
  socket: AppSocket
) => {
  socket.on("chat:sendMessage", ({ content }) => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return;

    const player = isPlayerInRoom(room, socket.id);
    if (!player) return;

    const newMessage = chatService.createMessage(
      socket,
      player.name,
      content
    );

    io.to(room.id).emit("chat:newMessage", newMessage);
  });

  socket.on("chat:typing:start", () => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return;

    const player = isPlayerInRoom(room, socket.id);
    if (!player) return;

    socket.to(room.id).emit("chat:typing:start", {
      playerId: socket.id,
    });
  });

  socket.on("chat:typing:stop", () => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return;

    const player = isPlayerInRoom(room, socket.id);
    if (!player) return;

    socket.to(room.id).emit("chat:typing:stop", {
      playerId: socket.id,
    });
  });

  socket.on("chat:read", ({ lastReadCreatedAt }) => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return;

    socket.to(room.id).emit("chat:readUpdate", {
      playerId: socket.id,
      lastReadCreatedAt,
    });
  });
};
