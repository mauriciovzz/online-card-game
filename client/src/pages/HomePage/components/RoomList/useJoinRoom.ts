import { useCallback } from "react";
import { useNavigate } from "react-router";

import { ERRORS_MAP } from "@/constants";
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
            void navigate(`/lobby/${res.data.roomId}`);
          } else {
            errorNoti(ERRORS_MAP[res.error]);
            fetchRooms();
          }
        }
      );
    },
    [errorNoti, fetchRooms, navigate, socket]
  );

  return { joinRoom };
};
