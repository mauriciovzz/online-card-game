import { type ReactNode } from "react";

import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "../RoomContext";
import { ChatContext } from "./ChatContext";
import { useChatState } from "./useChatState";

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { socketRef } = useSocket();
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
    lastReadRef,

    getMessageChecks,
  } = useChatState(socketRef, room.players);

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
        lastReadRef,

        getMessageChecks,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
