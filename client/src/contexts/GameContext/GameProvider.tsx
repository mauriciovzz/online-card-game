import {
  type ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { GameContext } from "./GameContext";
import { Spinner } from "../../components/Spinner";
import type { Room, Message } from "../../types/types";
import { useNavigate, useParams } from "react-router";
import { useSocket } from "../SocketContext";
import { useDisclosure } from "@mantine/hooks";

export const GameProvider = ({
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

  const handleNewMessage = useCallback(
    (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);

      if (!chatOpenedRef.current) {
        setUnreadMessages((prev) => prev + 1);
      }
    },
    []
  );

  const handleUpdatedInfo = useCallback(
    (newRoomData: Room) => {
      setRoom(newRoomData);
      console.log(newRoomData);
    },
    []
  );

  const handleGameStarted = useCallback(
    ({ roomId }: { roomId: string }) => {
      if (roomId) {
        void navigate(`/room/${roomId}/game`);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getInfo", { roomId });

    socket.on("chat:newMessage", handleNewMessage);
    socket.on("room:updatedInfo", handleUpdatedInfo);
    socket.on("room:gameStarted", handleGameStarted);

    return () => {
      socket.off("chat:newMessage", handleNewMessage);
      socket.off("room:updatedInfo", handleUpdatedInfo);
      socket.off("room:gameStarted", handleGameStarted);
    };
  }, [
    handleGameStarted,
    handleNewMessage,
    handleUpdatedInfo,
    roomId,
    socket,
  ]);

  const sendMessage = (message: string) => {
    if (!socket || !room) return;

    socket.emit("chat:sendMessage", {
      roomId: room.roomId,
      message,
    });
  };

  const openChat = () => {
    setUnreadMessages(0);
    chatHandlers.open();
  };

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
