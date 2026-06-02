import { useCallback } from "react";

import { RESPONSE_METADATA } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import {
  useNotification,
  useRoomErrorHandler,
} from "@/hooks";

import type {
  SocketRes,
  EmptyResponse,
} from "@shared/types";

export const useEditRoomPlayers = () => {
  const { successNoti } = useNotification();
  const { socket } = useSocket();
  const handleError = useRoomErrorHandler();

  const kickPlayerOut = useCallback(
    (playerId: string) => {
      socket?.emit(
        "room:kickPlayer",
        { playerId },
        (res: SocketRes<EmptyResponse>) => {
          if (res.success) {
            successNoti(RESPONSE_METADATA.USER_KICKED_OUT);
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
