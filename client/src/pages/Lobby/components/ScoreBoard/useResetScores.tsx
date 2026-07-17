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

export const useResetScores = () => {
  const { socket } = useSocket();

  const handleError = useRoomErrorHandler();
  const { successNoti } = useNotification();

  const resetScores = useCallback(() => {
    socket?.emit(
      "room:resetScores",
      (res: SocketRes<EmptyResponse>) => {
        if (res.success) {
          successNoti(RESPONSE_METADATA.SCORES_RESET);
        } else {
          handleError(res.error);
        }
      }
    );
  }, [socket, successNoti, handleError]);

  return { resetScores };
};
