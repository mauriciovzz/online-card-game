import { createContext, useContext } from "react";

import type { Room } from "@shared/types";

interface RoomContextTypes {
  roomView: "lobby" | "game";

  room: Room;
  isAdmin: boolean;
  clientColor: string;

  leaveRoom: () => void;
  stopGame: () => void;
  startGame: () => void;

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
