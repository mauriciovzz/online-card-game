import { Message } from "@shared/types";
import { AppSocket } from "@/types";

const createMessage = (
  socket: AppSocket,
  playerName: string,
  content: string
) => {
  const newMessage: Message = {
    id: crypto.randomUUID(),
    senderId: socket.id,
    senderName: playerName,
    content,
    createdAt: new Date().getTime(),
  };

  return newMessage;
};

export default { createMessage };
