import {
  createContext,
  useContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { Socket } from "socket.io-client";

import type { Room } from "@shared/types";

interface SocketContextTypes {
  socketRef: RefObject<Socket | null>;
  socketId: string | undefined;

  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;

  rooms: Room[];
  fetchRooms: () => void;
}

export const SocketContext = createContext<SocketContextTypes | undefined>(
  undefined,
);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a TasksProvider");
  }
  return context;
};
