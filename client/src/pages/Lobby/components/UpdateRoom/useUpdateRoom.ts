import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import { ERRORS_MAP, MESSAGES_MAP } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";
import { useNotification } from "@/hooks";

import type {
  RoomInfo,
  Room,
  SocketRes,
  ResMessage,
} from "@shared/types";

export const useUpdateRoom = (
  room: Room,
  close: () => void
) => {
  const { t } = useTranslation();
  const { successNoti } = useNotification();
  const { socket } = useSocket();
  const { handleError } = useRoom();

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
      socket?.emit(
        "room:update",
        newData,
        (res: SocketRes<ResMessage>) => {
          if (res.success) {
            successNoti(MESSAGES_MAP[res.data.message]);
            close();
          } else {
            if (res.type === "VALIDATION") {
              const errorMsg = ERRORS_MAP[res.error];
              form.setFieldError("name", t(errorMsg));
            } else {
              handleError(res.error);
            }
          }
        }
      );
    },
    [socket, successNoti, close, form, t, handleError]
  );

  return { form, updateRoom };
};
