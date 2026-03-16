import { Group, Text, Divider } from "@mantine/core";

import { ItemButton } from "./ItemButton";
import { PlayersSlots } from "./PlayersSlots";
import { RulesIcons } from "./RulesIcons";

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

        <RulesIcons rules={room.rules} />

        <Divider orientation="vertical" />

        <PlayersSlots
          players={room.players}
          roomCapacity={Number(room.capacity)}
        />
      </Group>
    </ItemButton>
  );
};
