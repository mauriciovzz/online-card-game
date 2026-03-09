import { createContext, useContext } from "react";
import type { Message, Room } from "../../types/types";

interface GameContextTypes {
  room: Room;
  messages: Message[];
  unreadMessages: number;
  chatOpened: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => void;
}

export const GameContext = createContext<
  GameContextTypes | undefined
>(undefined);

export const useRoom = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error(
      "useRoom must be used within a TasksProvider"
    );
  }
  return context;
};
