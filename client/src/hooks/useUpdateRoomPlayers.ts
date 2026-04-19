import { useEffect } from "react";

import { useSocket } from "@/contexts/SocketContext";

import type { SocketRes, UserName } from "@/types";

interface Capacity {
  capacity: number;
}

export const useUpdateRoomPlayers = (
  onFormSuccess: () => void,
  onFormError: (erroName: string) => void
) => {
  const { socket, setUserName } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("room:updateCapacity", handleNameUpdated);

    return () => {
      socket.off("user:updateCapacity", handleNameUpdated);
    };
  }, [socket, setUserName, onFormSuccess, onFormError]);

  const updateCapacity = (capacity: Capacity) => {
    socket?.emit("room:updateCapacity", capacity);
  };

  return {
    updateCapacity,
  };
};
