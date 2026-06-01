import { Group, Text, Divider } from "@mantine/core";

import { SelectedRules } from "@/components";
import { ItemButton } from "./ItemButton";
import { PlayersSlots } from "./PlayersSlots";

import type { Room } from "@shared/types";

interface RoomListItemProps {
  room: Room;
  joinRoom: () => void;
}

export const RoomButton = ({
  room,
  joinRoom,
}: RoomListItemProps) => (
  <ItemButton onClick={joinRoom}>
    <Group w="100%" gap={10}>
      <Text flex={1} size="sm" truncate="end">
        {room.name}
      </Text>

      <Divider orientation="vertical" />

      <SelectedRules rules={room.rules} isSmall />

      <Divider orientation="vertical" />

      <PlayersSlots
        players={room.players}
        roomCapacity={Number(room.capacity)}
      />
    </Group>
  </ItemButton>
);
