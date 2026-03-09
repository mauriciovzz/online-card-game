import {
  type ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { GameContext } from "./RoomContext";
import { Spinner } from "../../components/Spinner";
import type {
  Room,
  Message,
  SocketRes,
  RoomId,
} from "../../types/types";
import { useNavigate, useParams } from "react-router";
import { useSocket } from "../SocketContext";
import { useDisclosure } from "@mantine/hooks";

export const RoomProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatOpened, chatHandlers] = useDisclosure(false);

  const chatOpenedRef = useRef(chatOpened);

  useEffect(() => {
    chatOpenedRef.current = chatOpened;
  }, [chatOpened]);

  const sendMessage = (message: string) => {
    if (!socket || !room) return;
    socket.emit("chat:sendMessage", { message });
  };

  const openChat = () => {
    setUnreadMessages(0);
    chatHandlers.open();
  };

  const handleNewMessage = useCallback(
    (res: SocketRes<Message>) => {
      if (res.success) {
        console.log(res);
        setMessages((prev) => [...prev, res.data]);

        if (!chatOpenedRef.current) {
          setUnreadMessages((prev) => prev + 1);
        }
      }
    },
    []
  );

  const handleNewInfo = useCallback(
    (res: SocketRes<Room>) => {
      if (res.success) {
        setRoom(res.data);
      }
    },
    []
  );

  const handleGameStarted = useCallback(
    (res: SocketRes<RoomId>) => {
      if (res.success) {
        void navigate(`/room/${res.data.roomId}/game`);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getInfo");

    socket.on("chat:newMessage", handleNewMessage);
    socket.on("room:newInfo", handleNewInfo);
    socket.on("room:gameStarted", handleGameStarted);

    return () => {
      socket.off("chat:newMessage", handleNewMessage);
      socket.off("room:newInfo", handleNewInfo);
      socket.off("room:gameStarted", handleGameStarted);
    };
  }, [
    handleGameStarted,
    handleNewMessage,
    handleNewInfo,
    roomId,
    socket,
  ]);

  if (!room) return <Spinner />;

  return (
    <GameContext.Provider
      value={{
        room,
        messages,
        unreadMessages,
        chatOpened,
        openChat,
        closeChat: chatHandlers.close,
        sendMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
