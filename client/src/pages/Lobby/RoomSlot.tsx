import { Flex, Loader, Text } from "@mantine/core";
import type { PlayerSlot } from "../../types/types";
import { IconCancel } from "@tabler/icons-react";

interface LobbySlotProps {
  index: number;
  availableSlot: boolean;
  player: PlayerSlot | undefined;
}

const colors = ["blue", "red", "yellow", "green"];

const LobbySlot = ({
  index,
  availableSlot,
  player,
}: LobbySlotProps) => {
  const data = availableSlot ? (
    player ? (
      <Text c={`${colors[index]}.6`} fw={550}>
        {player.name}
      </Text>
    ) : (
      <Loader size="xs" color={colors[index]} type="dots" />
    )
  ) : (
    <IconCancel color="#ced4da" />
  );

  return (
    <Flex
      h={46.8}
      flex={1}
      bd={`1px solid ${availableSlot ? colors[index] : "#ced4da"}`}
      bdrs="lg"
      p="xs"
      align="center"
      justify="center"
    >
      {data}
    </Flex>
  );
};

export default LobbySlot;
