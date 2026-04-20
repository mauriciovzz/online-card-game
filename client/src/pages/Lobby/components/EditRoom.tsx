import { useState } from "react";
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

  const {
    handleSubmit,
    handleUpdateCapacity,
    handlePlayerKick,
  } = useUpdateRoom();

  const [capacity, setCapacity] = useState<RoomCapacity>(
    room.capacity
  );
  const [capacityError, setCapacityError] = useState("");

  const onCapacityChange = (value: string) => {
    setCapacityError("");

    if (Number(value) < room.players.length) {
      setCapacityError(t("errors.room.capacityConflict"));
      return;
    }

    setCapacity(value as RoomCapacity);
    handleUpdateCapacity(value as RoomCapacity);
  };

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

  const onSubmit = (values: UpdateRoomProps) => {
    handleSubmit(values);
    setTimeout(() => {
      onSuccess();
    }, 50);
  };

  return (
    <form
      onSubmit={form.onSubmit(onSubmit)}
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
              <Label text={t("room.members")} size="sm" />
              <RoomPlayers
                room={room}
                isEditable
                onKick={handlePlayerKick}
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
