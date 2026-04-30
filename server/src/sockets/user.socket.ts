import { users } from "@/stores";
import { userService } from "@/services";
import { ok } from "@/utils/emiterHelper";
import { handleExit } from "@/loop/gameLoop";

import { AppServer, AppSocket } from "@/types";

export const userSocket = (
  io: AppServer,
  socket: AppSocket
) => {
  let name = userService.generateName(socket.id);
  socket.emit("user:connected", { name });

  socket.on("user:updateName", ({ newName }, callback) => {
    const res = userService.updateName(socket.id, newName);

    if (res.success) {
      name = newName;
      ok(callback, res.data);
    } else {
      callback(res);
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;

    if (roomId) {
      handleExit(io, socket);
    }

    users.delete(socket.id);
  });
};
