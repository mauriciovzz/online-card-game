import { Flex, Loader, Text } from "@mantine/core";
import { IconCancel } from "@tabler/icons-react";
import type { PlayerSlot } from "../../types/types";

interface PlayerSlotBoxProps {
  index: number;
  player: PlayerSlot | undefined;
  capacity: 2 | 3 | 4;
}

export const PlayerSlotBox = ({
  index,
  player,
  capacity,
}: PlayerSlotBoxProps) => {
  const isInsideCapacity = index < capacity;

  if (!isInsideCapacity) {
    return (
      <Flex
        h={68}
        w="100%"
        bg="gray"
        align="center"
        justify="center"
        bdrs="lg"
      >
        <IconCancel color="black" />
      </Flex>
    );
  }

  if (!player) {
    return (
      <Flex
        h={68}
        w="100%"
        bg="gray"
        align="center"
        justify="center"
        bdrs="lg"
      >
        <Loader color="black" type="dots" />
      </Flex>
    );
  }

  return (
    <Flex
      h={68}
      w="100%"
      bg={player.color}
      align="center"
      justify="center"
      bdrs="lg"
    >
      <Text>{player.name}</Text>
    </Flex>
  );
};
