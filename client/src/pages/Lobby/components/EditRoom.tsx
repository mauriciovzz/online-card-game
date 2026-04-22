import { useCallback, useState } from "react";
import {
  SegmentedControl,
  Stack,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";

import { useUpdateRoom } from "@/hooks/useUpdateRoom";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ROOM_CAPACITY_OPTIONS } from "@/constants";
import {
  AppButton,
  Label,
  RoomPlayers,
  RoomForm,
} from "@/components";

import type {
  UpdateRoomProps,
  Room,
  RoomCapacity,
} from "@/types";

interface Props {
  room: Room;
  onSuccess: () => void;
}

export const EditRoom = ({ room, onSuccess }: Props) => {
  const { t } = useTranslation();

  const themeColor = useThemeColor();
  const isMobile = useIsMobile();

  // update form data ----------
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

  const onFormError = useCallback(
    (errorName: string) => {
      const map: Record<string, string> = {
        NAME_EMPTY: "errors.name.empty",
        NAME_MAX_LENGTH: "errors.room.maxLength",
      };

      form.setFieldError("name", t(map[errorName]));
    },
    [form, t]
  );

  // update capacity ----------
  const [capacity, setCapacity] = useState(room.capacity);
  const [capacityError, setCapacityError] = useState("");

  const onCapacityChange = (value: RoomCapacity) => {
    setCapacityError("");

    if (Number(value) < room.players.length) {
      setCapacityError(t("errors.room.capacityConflict"));
      return;
    }

    setCapacity(value);
    updateCapacity(value);
  };

  const onCapacityError = useCallback(
    (errorName: string) => {
      const map: Record<string, string> = {
        CAPACITY_CONFLICT: "errors.room.capacityConflict",
      };

      setCapacityError(t(map[errorName]));
    },
    [t]
  );

  // kick players out ----------
  const [kickError, setKickError] = useState("");

  const onKickError = useCallback(
    (errorName: string) => {
      const map: Record<string, string> = {
        PLAYER_NOT_FOUND: "errors.room.playerNotFound",
      };

      setKickError(t(map[errorName]));
    },
    [t]
  );

  // hook -----------
  const { updateRoom, updateCapacity, kickPlayerOut } =
    useUpdateRoom({
      onSuccess,
      onFormError,
      onCapacityError,
      onKickError,
    });

  return (
    <form
      onSubmit={form.onSubmit(updateRoom)}
      style={{
        height: "100%",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${themeColor}`,
        borderRadius: "8px",
      }}
    >
      <Stack flex={1} gap="sm">
        <Title>{t("room.update")}</Title>

        <RoomForm
          form={form}
          capacityComponent={
            <Stack gap={0} w="100%">
              <Label
                text={t("room.numPlayers")}
                size="sm"
                error={capacityError}
              />
              <SegmentedControl
                size={isMobile ? "md" : "sm"}
                value={capacity}
                onChange={onCapacityChange}
                data={ROOM_CAPACITY_OPTIONS}
              />
            </Stack>
          }
          playersComponent={
            <Stack gap={0} w="100%">
              <Label
                text={t("room.members")}
                size="sm"
                error={kickError}
              />
              <RoomPlayers
                room={room}
                isEditable
                onKick={kickPlayerOut}
              />
            </Stack>
          }
        />
      </Stack>

      <AppButton
        type="submit"
        text={t("common.save")}
        disabled={!form.values.name}
      />
    </form>
  );
};
