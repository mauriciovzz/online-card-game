import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

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
  RoomInfo,
  Room,
  SocketRes,
  EmptyResponse,
} from "@shared/types";

export const useUpdateRoom = (room: Room) => {
  const { t } = useTranslation();

  const { socket } = useSocket();

  const handleError = useRoomErrorHandler();
  const { successNoti } = useNotification();

  const form = useForm<RoomInfo>({
    mode: "uncontrolled",
    initialValues: {
      name: room.name,
      turnDuration: room.turnDuration,
      rules: room.rules,
    },

    validate: {
      name: (value) => {
        if (value.length < 1)
          return t("errors.common.empty");
        if (value.length > 15)
          return t("errors.room.maxLength");
        return null;
      },
    },
  });

  const updateRoom = useCallback(
    (newData: RoomInfo) => {
      const currentData = {
        name: room.name,
        turnDuration: room.turnDuration,
        rules: room.rules,
      };

      const dataChanged =
        JSON.stringify(newData) !==
        JSON.stringify(currentData);

      if (dataChanged) {
        socket?.emit(
          "room:update",
          newData,
          (res: SocketRes<EmptyResponse>) => {
            if (res.success) {
              successNoti(RESPONSE_METADATA.ROOM_UPDATED);
            } else {
              switch (res.error) {
                case ERROR_CODES.NAME_EMPTY:
                case ERROR_CODES.ROOM_LENGTH: {
                  const meta = ERROR_METADATA[res.error];
                  if (!meta.message) return;

                  form.setFieldError(
                    "name",
                    t(meta.message)
                  );
                  return;
                }

                default:
                  handleError(res.error);
                  return;
              }
            }
          }
        );
      }
    },
    [room, socket, successNoti, handleError, form, t]
  );

  return { form, updateRoom };
};
