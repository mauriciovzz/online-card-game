import {
  type ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";

import { SocketContext } from "./SocketContext";
import { SpinnerLayout } from "@/layouts";

import type {
  Room,
  AvailableRooms,
  UserName,
  SuccessResponse,
} from "@shared/types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const socketRef = useRef<Socket | null>(null);

  const [userName, setUserName] = useState("");
  const [isNameReady, setIsNameReady] = useState(false);

  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [areRoomsReady, setAreRoomsReady] = useState(false);

  const handleConnected = useCallback(
    ({ name }: UserName) => {
      setUserName(name);
      setIsNameReady(true);
    },
    []
  );

  const handleAvailable = useCallback(
    ({ availableRooms }: AvailableRooms) => {
      setRooms(availableRooms);
    },
    []
  );

  const fetchRooms = useCallback(() => {
    socketRef.current?.emit(
      "room:getAvailable",
      (res: SuccessResponse<AvailableRooms>) => {
        setRooms(res.data.availableRooms);
        setAreRoomsReady(true);
      }
    );
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("user:connected", handleConnected);
    socket.on("room:availableRooms", handleAvailable);

    fetchRooms();

    return () => {
      socket.off("user:connected", handleConnected);
      socket.off("room:availableRooms", handleAvailable);
      socket.disconnect();
    };
  }, [handleAvailable, handleConnected, fetchRooms]);

  if (!isNameReady || !areRoomsReady || rooms === null) {
    return <SpinnerLayout />;
  }

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        userName,
        setUserName,
        rooms,
        fetchRooms,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
