import { Server, Socket } from "socket.io";

import { users } from "@/stores";
import gameLoop from "@/loop/gameLoop";
import { userService } from "@/services";
import { emit, ok } from "@/utils/emiterHelper";

import { SocketCallback, UserName } from "@/types";

export const userSocket = (io: Server, socket: Socket) => {

  let name = userService.generateName(socket.id);
  emit(socket, "user:connected", { name });

  socket.on(
    "user:updateName", 
    (
      { newName }: { newName: string}, 
      callback: SocketCallback<UserName>
    ) => {
    const res = userService.updateName(socket.id, newName);

    if (res.success) {
      name = newName;
      ok(callback, res.data)
    } else {
      callback(res);    
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    
    if (roomId) {
      gameLoop.handlePlayerExit(io, socket);
    }

    users.delete(socket.id);
  });

};
