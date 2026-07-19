import {
  IconCornerUpRight,
  IconCornerLeftDown,
  IconCornerDownLeft,
  IconCornerRightUp,
} from "@tabler/icons-react";

import { GAME_COLORS } from "@/constants";

import type { CardColor, Direction } from "@shared/types";

const DIRECTION_CONFIG = {
  1: {
    leftIcon: IconCornerUpRight,
    rightIcon: IconCornerDownLeft,
    verticalOffset: -16,
    horizontalOffset: -10,
  },

  [-1]: {
    leftIcon: IconCornerLeftDown,
    rightIcon: IconCornerRightUp,
    verticalOffset: -10,
    horizontalOffset: -16,
  },
} as const;

const SLOT_COLORS: Record<CardColor, string> = Object.fromEntries(
  GAME_COLORS.map((slot) => [slot.cardColor, slot.hex]),
) as Record<CardColor, string>;

interface Props {
  direction: Direction;
  color: CardColor;
  size?: number;
}

export const DirectionArrows = ({ direction, color, size = 40 }: Props) => {
  const config = DIRECTION_CONFIG[direction];

  const LeftIcon = config.leftIcon;
  const RightIcon = config.rightIcon;

  const sharedStyle = {
    position: "absolute" as const,
    color: SLOT_COLORS[color],
  };

  return (
    <>
      <LeftIcon
        size={size}
        style={{
          ...sharedStyle,
          top: config.verticalOffset,
          left: config.horizontalOffset,
        }}
      />

      <RightIcon
        size={size}
        style={{
          ...sharedStyle,
          bottom: config.verticalOffset,
          right: config.horizontalOffset,
        }}
      />
    </>
  );
};
