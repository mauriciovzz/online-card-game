import { type ReactNode } from "react";

import { useSocket } from "@/contexts/SocketContext";
import { ChatContext } from "./ChatContext";

import { useChatState } from "@/hooks/useChatState";
import { useRoom } from "../RoomContext";

export const ChatProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { socket } = useSocket();
  const { room } = useRoom();

  const {
    messages,
    unread,

    chatOpened,
    openChat,
    closeChat,

    sendMessage,

    typers,
    startTyping,

    emitRead,
    lastReadTS,

    getMessageChecks,
  } = useChatState(socket, room.players);

  return (
    <ChatContext.Provider
      value={{
        messages,
        unread,

        chatOpened,
        openChat,
        closeChat,

        sendMessage,

        typers,
        startTyping,

        emitRead,
        lastReadTS,

        getMessageChecks,

        myId: socket?.id,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
