import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";

import type {
  CreateRoomProps,
  RoomId,
  SocketRes,
} from "@/types";

export const useCreateRoom = () => {
  const navigate = useNavigate();

  const { socket } = useSocket();

  const handleCreated = useCallback(
    (res: SocketRes<RoomId>) => {
      if (res.success) {
        void navigate(`/room/${res.data.roomId}/lobby`);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("room:created", handleCreated);

    return () => {
      socket.off("room:created", handleCreated);
    };
  }, [handleCreated, socket]);

  const handleSubmit = (newRoom: CreateRoomProps) => {
    socket?.emit("room:create", newRoom);
  };

  return {
    handleSubmit,
  };
};
