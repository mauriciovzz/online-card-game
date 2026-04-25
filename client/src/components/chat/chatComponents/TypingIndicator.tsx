import { Group, Avatar, Flex, Loader } from "@mantine/core";

import { PLAYER_SLOTS } from "@/constants";
import { useRoom } from "@/contexts/RoomContext";

interface Props {
  typers: Set<string>;
  themeColor: string;
}

export const TypingIndicator = ({
  typers,
  themeColor,
}: Props) => {
  const { room } = useRoom();

  return (
    <Group gap={3}>
      <Avatar.Group spacing="xs">
        {room.players
          .filter((p) => typers.has(p.id))
          .map((p) => (
            <Avatar
              key={`avatar_${p.id}`}
              variant="filled"
              size={22}
              color={PLAYER_SLOTS[p.pos - 1].string}
              name={p.name}
            />
          ))}
      </Avatar.Group>

      <Flex
        h={22}
        w={52}
        justify="center"
        align="center"
        bd={`1px solid ${themeColor}`}
        bdrs="8px"
      >
        <Loader type="dots" size="xs" color={themeColor} />
      </Flex>
    </Group>
  );
};
