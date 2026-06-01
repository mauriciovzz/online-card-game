import { useCallback } from "react";

import { MESSAGES_MAP } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";
import { useNotification } from "@/hooks";

import type { SocketRes, ResMessage } from "@shared/types";

export const useEditRoomPlayers = () => {
  const { successNoti } = useNotification();
  const { socket } = useSocket();
  const { handleError } = useRoom();

  const kickPlayerOut = useCallback(
    (playerId: string) => {
      socket?.emit(
        "room:kickPlayer",
        { playerId },
        (res: SocketRes<ResMessage>) => {
          if (res.success) {
            successNoti(MESSAGES_MAP[res.data.message]);
          } else {
            handleError(res.error);
          }
        }
      );
    },
    [socket, successNoti, handleError]
  );

  return { kickPlayerOut };
};
