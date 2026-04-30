import { userSocket } from "./user.socket";
import { roomSocket } from "./room.socket";
import { gameSocket } from "./game.socket";
import { chatSocket } from "./chat.socket";

import { AppServer, AppSocket } from "@/types";

export const registerSocketHandlers = (
  io: AppServer,
  socket: AppSocket
) => {
  userSocket(io, socket);
  roomSocket(io, socket);
  chatSocket(io, socket);
  gameSocket(io, socket);
};
