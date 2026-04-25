import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useNotification } from "../../../../hooks/useNotification";

import type { RoomId, SocketRes } from "@/types";

const ERROR_MAP: Record<string, string> = {
  ROOM_NOT_FOUND: "room.error.notFound",
  ROOM_IS_FULL: "room.error.isFull",
};

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
            void navigate(`/room/${res.data.roomId}/lobby`);
          } else {
            errorNoti(ERROR_MAP[res.error]);
            fetchRooms();
          }
        }
      );
    },
    [errorNoti, fetchRooms, navigate, socket]
  );

  return { joinRoom };
};
