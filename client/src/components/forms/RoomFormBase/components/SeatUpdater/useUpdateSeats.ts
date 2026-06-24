import {
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";

import { ERROR_CODES } from "@shared/constants";
import {
  ERROR_METADATA,
  RESPONSE_METADATA,
} from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import {
  useNotification,
  useRoomErrorHandler,
} from "@/hooks";

import type {
  SocketRes,
  EmptyResponse,
  RoomSeat,
  PlayerPos,
} from "@shared/types";

export const useUpdateSeats = (
  setSeatError: Dispatch<SetStateAction<string>>
) => {
  const { t } = useTranslation();

  const { socket } = useSocket();

  const handleError = useRoomErrorHandler();
  const { successNoti } = useNotification();

  const openSeat = useCallback(
    (newData: RoomSeat) => {
      socket?.emit(
        "room:openSeat",
        newData,
        (res: SocketRes<EmptyResponse>) => {
          if (!res.success) {
            switch (res.error) {
              case ERROR_CODES.SEAT_TAKEN: {
                const meta = ERROR_METADATA[res.error];
                if (!meta.message) return;

                setSeatError(t(meta.message));
                return;
              }

              default:
                handleError(res.error);
                return;
            }
          }
        }
      );
    },
    [socket, handleError, setSeatError, t]
  );

  const closeSeat = useCallback(
    (pos: PlayerPos) => {
      socket?.emit(
        "room:closeSeat",
        { pos },
        (res: SocketRes<EmptyResponse>) => {
          if (!res.success) {
            switch (res.error) {
              case ERROR_CODES.SEAT_TAKEN: {
                const meta = ERROR_METADATA[res.error];
                if (!meta.message) return;

                setSeatError(t(meta.message));
                return;
              }

              default:
                handleError(res.error);
                return;
            }
          }
        }
      );
    },
    [socket, handleError, setSeatError, t]
  );

  const kickPlayerOut = useCallback(
    (pos: PlayerPos) => {
      socket?.emit(
        "room:kickPlayer",
        { pos },
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

  return { openSeat, closeSeat, kickPlayerOut };
};
