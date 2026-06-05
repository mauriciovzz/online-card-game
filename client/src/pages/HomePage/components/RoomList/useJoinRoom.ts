import { useCallback } from "react";
import { useNavigate } from "react-router";

import { ERROR_METADATA } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useNotification } from "@/hooks";

import type { RoomId, SocketRes } from "@shared/types";

export const useJoinRoom = () => {
  const navigate = useNavigate();
  const { socket, fetchRooms } = useSocket();
  const { errorNoti } = useNotification();

  const joinRoom = useCallback(
    (roomId: string) => {
      socket?.emit(
        "room:join",
        { roomId },
        (res: SocketRes<RoomId>) => {
          if (res.success) {
            void navigate(`/room/${res.data.roomId}`);
          } else {
            fetchRooms();

            const meta = ERROR_METADATA[res.error];
            if (!meta.message) return;

            errorNoti(meta.message);
          }
        }
      );
    },
    [errorNoti, fetchRooms, navigate, socket]
  );

  return { joinRoom };
};
