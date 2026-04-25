import { Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useThemeColor } from "@/hooks";
import { useUpdateRoom } from "./useUpdateRoom";
import {
  AppButton,
  RoomForm,
  CapacityChanger,
  EditableRoomPlayers,
} from "@/components";

import type { Room } from "@/types";

interface Props {
  room: Room;
  close: () => void;
}

export const UpdateRoomView = ({ room, close }: Props) => {
  const { t } = useTranslation();
  const themeColor = useThemeColor();
  const { form, updateRoom } = useUpdateRoom(room, close);

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
            <CapacityChanger room={room} />
          }
          playersComponent={
            <EditableRoomPlayers room={room} />
          }
        />
      </Stack>

      <AppButton
        type="submit"
        text={"common.save"}
        disabled={!form.values.name.trim()}
      />
    </form>
  );
};
