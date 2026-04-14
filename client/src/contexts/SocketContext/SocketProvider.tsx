import {
  type ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";

import { SpinnerLayout } from "@/layouts";
import { SocketContext } from "./SocketContext";

import type { SocketRes, UserName } from "@/types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const socketRef = useRef<Socket | null>(null);

  const [userName, setUserName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    socketRef.current = newSocket;

    const handleConnected = (res: SocketRes<UserName>) => {
      if (res.success) {
        setUserName(res.data.name);
        setIsReady(true);
      }
    };

    newSocket.on("user:connected", handleConnected);

    return () => {
      newSocket.off("user:connected", handleConnected);
      newSocket.disconnect();
    };
  }, []);

  if (!isReady) {
    return <SpinnerLayout />;
  }

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        userName,
        setUserName,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
