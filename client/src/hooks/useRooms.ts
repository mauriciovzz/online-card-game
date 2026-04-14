import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";

import type {
  AvailableRooms,
  Room,
  RoomId,
  SocketRes,
} from "@/types";

export const useRooms = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  const handleNewList = useCallback(
    (res: SocketRes<AvailableRooms>) => {
      if (res.success) {
        setRooms(res.data.availableRooms);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      }
    },
    []
  );

  const handleJoined = useCallback(
    (res: SocketRes<RoomId>) => {
      if (res.success) {
        void navigate(`/room/${res.data.roomId}/lobby`);
      } else {
        console.log(res.error);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getAvailable");

    socket.on("room:newList", handleNewList);
    socket.on("room:joined", handleJoined);

    return () => {
      socket.off("room:newList", handleNewList);
      socket.off("room:joined", handleJoined);
    };
  }, [socket, navigate, handleNewList, handleJoined]);

  const joinRoom = (roomId: RoomId) =>
    socket?.emit("room:join", roomId);

  return { isLoading, rooms, joinRoom };
};
