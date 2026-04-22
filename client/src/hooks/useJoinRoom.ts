import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useNotification } from "./useNotfication";

import type {
  AvailableRooms,
  ErrorResponse,
  Room,
  RoomId,
  SocketRes,
  SuccessResponse,
} from "@/types";

export const useJoinRoom = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { onError } = useNotification();

  const handleAvailable = useCallback(
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
    (res: SuccessResponse<RoomId>) => {
      void navigate(`/room/${res.data.roomId}/lobby`);
    },
    [navigate]
  );

  const handleError = useCallback(
    (res: ErrorResponse) => {
      let errorName = "";

      switch (res.error) {
        case "ROOM_IS_FULL":
          errorName = "room.error.isFull";
          break;
        case "ROOM_NOT_FOUND":
          errorName = "room.error.notFound";
          break;
      }

      onError(errorName);
      socket?.emit("room:getAvailable");
    },
    [onError, socket]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getAvailable");

    socket.on("room:availableRooms", handleAvailable);
    socket.on("room:joined", handleJoined);
    socket.on("room:error", handleError);

    return () => {
      socket.off("room:availableRooms", handleAvailable);
      socket.off("room:joined", handleJoined);
      socket.off("room:error", handleError);
    };
  }, [
    socket,
    navigate,
    handleAvailable,
    handleJoined,
    handleError,
  ]);

  const joinRoom = (roomId: RoomId) => {
    socket?.emit("room:join", roomId);
  };

  return { isLoading, rooms, joinRoom };
};
