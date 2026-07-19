import {
  type ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";

import { MainLayout } from "@/layouts";
import { SocketContext } from "./SocketContext";
import { useCardsMap } from "../CardsContext";
import { Spinner } from "@/components";

import type {
  Room,
  AvailableRooms,
  UserName,
  SuccessResponse,
} from "@shared/types";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL;

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const { cardsLoading } = useCardsMap();

  const socketRef = useRef<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);

  const [userName, setUserName] = useState("");
  const [isNameReady, setIsNameReady] = useState(false);

  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [areRoomsReady, setAreRoomsReady] = useState(false);

  const handleConnected = useCallback(({ name }: UserName) => {
    setUserName(name);
    setIsNameReady(true);
  }, []);

  const handleAvailable = useCallback(({ availableRooms }: AvailableRooms) => {
    setRooms(availableRooms);
  }, []);

  const fetchRooms = useCallback(() => {
    socketRef.current?.emit(
      "room:getAvailable",
      (res: SuccessResponse<AvailableRooms>) => {
        setRooms(res.data.availableRooms);
        setAreRoomsReady(true);
      },
    );
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("disconnect", () => {
      setSocketId(undefined);
    });

    socket.on("user:connected", handleConnected);
    socket.on("room:availableRooms", handleAvailable);

    fetchRooms();

    return () => {
      socket.off("user:connected", handleConnected);
      socket.off("room:availableRooms", handleAvailable);

      socket.disconnect();
      socketRef.current = null;
      setSocketId(undefined);
    };
  }, [handleAvailable, handleConnected, fetchRooms]);

  if (cardsLoading || !isNameReady || !areRoomsReady || rooms === null) {
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    );
  }

  return (
    <SocketContext.Provider
      value={{
        socketRef,
        socketId,

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
