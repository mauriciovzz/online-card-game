import { type ReactNode, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { Spinner } from "../../components/Spinner";
import type {
  SocketRes,
  UserName,
} from "../../types/types";

export const SocketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3003");

    setSocket(newSocket);

    newSocket.on(
      "user:connected",
      (res: SocketRes<UserName>) => {
        if (res.success) {
          setUserName(res.data.name);
        }
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (userName.length === 0) return <Spinner />;

  return (
    <SocketContext.Provider
      value={{ socket, userName, setUserName }}
    >
      {children}
    </SocketContext.Provider>
  );
};
