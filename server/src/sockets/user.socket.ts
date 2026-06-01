import { users } from "@/stores";
import { userService } from "@/services";
import { ok } from "@/utils/emiterHelper";
import { handleExit } from "@/loop/gameLoop";

import { AppServer, AppSocket } from "@/types";
import { checkUserName } from "@/utils/guards";

export const userSocket = (
  io: AppServer,
  socket: AppSocket
) => {
  let name = userService.generateName(socket.id);
  socket.emit("user:connected", { name });

  socket.on("user:updateName", ({ newName }, callback) => {
    const trimmedName = newName.trim();

    const isTaken = checkUserName(trimmedName, callback);
    if (!isTaken) return;

    userService.updateName(socket.id, trimmedName);
    name = newName;

    ok(callback, { name: trimmedName });
  });

  socket.on("disconnect", () => {
    handleExit(io, socket);
    users.delete(socket.id);
  });
};
