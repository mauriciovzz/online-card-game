import { Flex, Badge } from "@mantine/core";

import { useThemeColor } from "@/hooks";
import { PLAYER_SLOTS } from "@/constants";

import type { Player } from "@shared/types";

interface SlotBadgeProps {
  i: number;
  roomCapacity: number;
  player?: Player;
}

export const SlotBadge = ({
  i,
  roomCapacity,
  player,
}: SlotBadgeProps) => {
  const themeColor = useThemeColor();

  const enabled = i <= roomCapacity;

  const color = enabled
    ? PLAYER_SLOTS[i - 1].string
    : themeColor;

  const variant = enabled
    ? player
      ? "filled"
      : "outline"
    : "filled";

  return (
    <Badge
      variant={variant}
      color={color}
      size="sm"
      radius="sm"
    />
  );
};

interface PlayersSlotsProps {
  players: Player[];
  roomCapacity: number;
}

export const PlayersSlots = ({
  players,
  roomCapacity,
}: PlayersSlotsProps) => {
  return (
    <Flex w={84} h={20} wrap="wrap" gap={4}>
      {[1, 2, 3, 4].map((i) => (
        <SlotBadge
          key={i}
          i={i}
          player={players.find((p) => p.pos === i)}
          roomCapacity={roomCapacity}
        />
      ))}
    </Flex>
  );
};
