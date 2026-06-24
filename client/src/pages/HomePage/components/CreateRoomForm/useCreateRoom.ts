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
import { ERROR_CODES } from "@shared/constants";

export const useCreateRoom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { socket } = useSocket();

  const form = useForm<CreateRoomProps>({
    mode: "controlled",
    initialValues: {
      name: "",
      turnDuration: TURN_DURATIONS[0].value,
      seats: [
        { pos: 2, type: undefined },
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
      seats: (value) => {
        const members = value.filter((s) => s.type).length;

        if (members === 0)
          return t("errors.room.notEnoughtSeats");

        return null;
      },
    },
  });

  const createRoom = useCallback(
    (newData: CreateRoomProps) => {
      socket?.emit(
        "room:create",
        newData,
        (res: SocketRes<RoomId>) => {
          if (res.success) {
            void navigate(`/room/${res.data.roomId}`);
          } else {
            const meta = ERROR_METADATA[res.error];
            if (!meta.message) return;

            switch (res.error) {
              case ERROR_CODES.ROOM_LENGTH: {
                form.setFieldError("name", t(meta.message));
                return;
              }
              case ERROR_CODES.NOT_ENOUGH_SEATS: {
                form.setFieldError(
                  "seats",
                  t(meta.message)
                );
                return;
              }
            }
          }
        }
      );
    },
    [socket, navigate, form, t]
  );

  return { form, createRoom };
};
