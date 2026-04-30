import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import { useSocket } from "@/contexts/SocketContext";

import type {
  CreateRoomProps,
  SocketRes,
  RoomId,
} from "@shared/types";

const ERROR_MAP: Record<string, string> = {
  NAME_EMPTY: "errors.name.empty",
  NAME_MAX_LENGTH: "errors.room.maxLength",
};

export const useCreateRoom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { socket } = useSocket();

  const form = useForm<CreateRoomProps>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      turnDuration: "30",
      capacity: "2",
      rules: {
        mirror: false,
        stair: false,
        stack: false,
      },
    },
    validate: {
      name: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return t("errors.common.empty");
        if (trimmed.length > 15)
          return t("errors.room.maxLength");
        return null;
      },
    },
  });

  const createRoom = useCallback(
    (newRoom: CreateRoomProps) => {
      socket?.emit(
        "room:create",
        newRoom,
        (res: SocketRes<RoomId>) => {
          if (res.success) {
            void navigate(`/room/${res.data.roomId}/lobby`);
          } else {
            const key = ERROR_MAP[res.error];
            form.setFieldError("name", t(key));
          }
        }
      );
    },
    [socket, navigate, form, t]
  );

  return { form, createRoom };
};
