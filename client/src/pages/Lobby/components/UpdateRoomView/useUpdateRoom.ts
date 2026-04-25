import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import { useSocket } from "@/contexts/SocketContext";
import { useNotification } from "@/hooks";

import type {
  UpdateRoomProps,
  Room,
  SocketRes,
} from "@/types";

const ERROR_MAP: Record<string, string> = {
  NAME_EMPTY: "errors.name.empty",
  NAME_MAX_LENGTH: "errors.room.maxLength",
  NOT_ADMIN: "errors.room.notAdmin",
};

export const useUpdateRoom = (
  room: Room,
  close: () => void
) => {
  const { t } = useTranslation();

  const { socket } = useSocket();
  const { successNoti, errorNoti } = useNotification();

  const form = useForm<UpdateRoomProps>({
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
    (newData: UpdateRoomProps) => {
      socket?.emit(
        "room:update",
        newData,
        (res: SocketRes<null>) => {
          if (res.success) {
            successNoti("room.notification.updated");
            close();
          } else {
            const error = res.error;

            if (error === "NOT_ADMIN") {
              errorNoti(ERROR_MAP[error]);
            } else {
              form.setFieldError(
                "name",
                t(ERROR_MAP[error])
              );
            }
          }
        }
      );
    },
    [socket, successNoti, close, errorNoti, form, t]
  );

  return { form, updateRoom };
};
