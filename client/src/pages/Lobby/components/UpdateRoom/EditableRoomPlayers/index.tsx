import { Stack } from "@mantine/core";

import { useEditRoomPlayers } from "./useEditRoomPlayers";
import { Label, RoomPlayers } from "@/components";

import type { Room } from "@shared/types";

interface Props {
  room: Room;
}

export const EditableRoomPlayers = ({ room }: Props) => {
  const { kickPlayerOut } = useEditRoomPlayers();

  return (
    <Stack gap={0} w="100%">
      <Label size="sm" text={"room.members"} />
      <RoomPlayers
        room={room}
        isEditable
        onKick={kickPlayerOut}
      />
    </Stack>
  );
};
