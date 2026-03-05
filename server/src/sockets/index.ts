import { Server, Socket } from "socket.io";
import { userSocket } from "./user.socket";
import { roomSocket } from "./room.socket";
import { gameSocket } from "./game.socket";
import { chatSocket } from "./chat.socket";

export const registerSocketHandlers = (io: Server, socket: Socket) => {
  userSocket(io, socket);
  roomSocket(io, socket);
  chatSocket(io, socket);
  gameSocket(io, socket);
};
