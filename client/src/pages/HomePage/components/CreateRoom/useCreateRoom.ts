import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useForm } from "@mantine/form";

import {
  ERROR_METADATA,
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
    mode: "controlled",
    initialValues: {
      name: "",
      turnDuration: TURN_DURATIONS[0].value,
      players: [
        { pos: 2, type: "human" },
        { pos: 3, type: undefined },
        { pos: 4, type: undefined },
      ],
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
            void navigate(`/room/${res.data.roomId}`);
          } else {
            const meta = ERROR_METADATA[res.error];
            if (!meta.message) return;

            form.setFieldError("name", t(meta.message));
          }
        }
      );
    },
    [socket, navigate, form, t]
  );

  return { form, createRoom };
};
