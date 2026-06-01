import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import {
  ERRORS_MAP,
  ROOM_CAPACITY_OPTIONS,
  TURN_DURATIONS,
} from "@/constants";
import { useSocket } from "@/contexts/SocketContext";

import type {
  CreateRoomProps,
  SocketRes,
  RoomId,
} from "@shared/types";

export const useCreateRoom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { socket } = useSocket();

  const form = useForm<CreateRoomProps>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      turnDuration: TURN_DURATIONS[0].value,
      capacity: ROOM_CAPACITY_OPTIONS[0].value,
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
            void navigate(`/lobby/${res.data.roomId}`);
          } else {
            const errorMsg = ERRORS_MAP[res.error];
            form.setFieldError("name", t(errorMsg));
          }
        }
      );
    },
    [socket, navigate, form, t]
  );

  return { form, createRoom };
};
