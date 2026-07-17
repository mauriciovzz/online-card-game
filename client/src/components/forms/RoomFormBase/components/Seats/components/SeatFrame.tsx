import { ActionIcon, Flex } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";

import {
  SEAT_HEIGHT,
  SEAT_WIDTH,
} from "../constants/seatSize";
import { useIsDark } from "@/hooks";

import type { PlayerPos } from "@shared/types";
import type { Action } from "@/types";

const CircleButtom = ({
  color,
  action: { icon, corner, onClick },
}: {
  color: string;
  action: Action;
}) => {
  const isDark = useIsDark();
  const Icon = icon ?? IconMinus;

  return (
    <ActionIcon
      variant="outline"
      size="xs"
      color={color}
      autoContrast
      bg={isDark ? "dark.7" : "gray.1"}
      pos="absolute"
      style={{ zIndex: 10 }}
      top={corner ? -1 : undefined}
      right={corner ? -1 : undefined}
      onClick={onClick}
    >
      <Icon size={12} />
    </ActionIcon>
  );
};

const SEAT_POSITIONS = {
  1: {
    gridColumn: 2,
    gridRow: 2,
  },
  2: {
    gridColumn: 1,
    gridRow: "1 / span 2",
    alignSelf: "center",
  },
  3: {
    gridColumn: 2,
    gridRow: 1,
  },
  4: {
    gridColumn: 3,
    gridRow: "1 / span 2",
    alignSelf: "center",
  },
} as const;

interface Props {
  pos: PlayerPos;
  color?: string;
  pad?: boolean;
  action?: Action;
  children: React.ReactNode;
}

export const SeatFrame = ({
  pos,
  color,
  action,
  children,
}: Props) => {
  const isDark = useIsDark();
  const themeBackground = isDark ? "dark.8" : "gray.1";

  return (
    <Flex
      w={SEAT_WIDTH}
      h={SEAT_HEIGHT}
      justify="center"
      align="center"
      bg={themeBackground}
      bd={`1px solid ${color ?? themeBackground}`}
      bdrs="8px"
      p={4}
      pos="relative"
      style={{
        userSelect: "none",
        ...SEAT_POSITIONS[pos],
      }}
    >
      {children}

      {action && color && (
        <CircleButtom color={color} action={action} />
      )}
    </Flex>
  );
};
