import { useEffect } from "react";

import { useSocket } from "@/contexts/SocketContext";

import type { RoomId, SocketRes } from "@/types";

export const useCreateRoom = (
  onFormSuccess: (roomId: string) => void,
  onFormError: (errorName: string) => void
) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (res: SocketRes<RoomId>) => {
      if (res.success) {
        onFormSuccess(res.data.roomId);
      } else {
        onFormError(res.error);
      }
    };

    socket.on("room:created", handleCreated);

    return () => {
      socket.off("room:created", handleCreated);
    };
  }, [onFormError, onFormSuccess, socket]);
};
