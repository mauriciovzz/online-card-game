import type { Room } from "@/types";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Socket } from "socket.io-client";

interface SocketContextTypes {
  socket: Socket | null;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  rooms: Room[];
  fetchRooms: () => void;
}

export const SocketContext = createContext<
  SocketContextTypes | undefined
>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocket must be used within a TasksProvider"
    );
  }
  return context;
};
