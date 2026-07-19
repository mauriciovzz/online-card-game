import { createContext, useContext, type RefObject } from "react";

import type { Message } from "@shared/types";

interface ChatContextTypes {
  messages: Message[];
  unread: number;

  chatOpened: boolean;
  openChat: () => void;
  closeChat: () => void;

  sendMessage: (message: string) => void;

  typers: Set<string>;
  startTyping: () => void;

  emitRead: (timestamp: number) => void;
  lastReadRef: RefObject<number>;

  getMessageChecks: (id: string) => { playerId: string; isRead: boolean }[];
}

export const ChatContext = createContext<ChatContextTypes | undefined>(
  undefined,
);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a TasksProvider");
  }
  return context;
};
