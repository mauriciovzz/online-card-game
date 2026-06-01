import { createContext, useContext } from "react";

import type { Room } from "@shared/types";

interface RoomContextTypes {
  room: Room;
  isAdmin: boolean;

  leaveRoom: () => void;
  startGame: () => void;
  handleError: (error: string) => void;

  settingsOpened: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

export const RoomContext = createContext<
  RoomContextTypes | undefined
>(undefined);

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error(
      "useRoom must be used within a TasksProvider"
    );
  }
  return context;
};
