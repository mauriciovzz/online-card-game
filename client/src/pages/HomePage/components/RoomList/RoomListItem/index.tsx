import { Group, Text, Divider } from "@mantine/core";

import { SelectedRules } from "@/components";
import { ItemButton } from "./ItemButton";
import { PlayersSlots } from "./PlayersSlots";

import type { Room, RoomId } from "@/types";

interface RoomListItemProps {
  room: Room;
  joinRoom: (roomId: RoomId) => void;
}

export const RoomsListItem = ({
  room,
  joinRoom,
}: RoomListItemProps) => {
  const handleJoinRoom = () => {
    joinRoom({ roomId: room.id });
  };

  return (
    <ItemButton onClick={handleJoinRoom}>
      <Group w="100%" gap={10}>
        <Text flex={1} size="sm">
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
};
