import { Server, Socket } from "socket.io";
import gameLoop from "@/loop/gameLoop";
import { userService } from "@/services";
import { users } from "@/stores";
import logger from "@/utils/logger";

export const userSocket = (io: Server, socket: Socket) => {

  let name = userService.generateName(socket.id);
  socket.emit("user:connected", { name });
  logger.socketLog(socket.id, `new player ${name}.`);

  socket.on("user:updateName", ({ newName }: { newName: string}) => {
    const res = userService.updateName(socket.id, newName);

    if (res.success) {
      logger.socketLog(socket.id, `name changed from '${name}' to '${newName}'.`)
      name = newName;
    };

    socket.emit("user:nameUpdated", res);
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    
    if (roomId) {
      gameLoop.handlePlayerExit(
        io,
        socket,
        roomId,
        "DISCONNECT",
      );
    } else {
      logger.socketLog(socket.id, `${name} disconnected.`);
    };

    users.delete(socket.id);
  });

};
