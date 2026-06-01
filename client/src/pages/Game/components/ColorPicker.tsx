import { Box, Group } from "@mantine/core";

import { GAME_COLORS } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppActionIcon } from "@/components";

import type { CardColor } from "@shared/types";

interface Props {
  pick: (color: CardColor) => void;
}

export const ColorPicker = ({ pick }: Props) => {
  const isMobile = useIsMobile();
  const height = isMobile ? 42 : 36;

  return (
    <Group w="100%" h={height} bg="transparent" gap="sm">
      {GAME_COLORS.map((c) => (
        <AppActionIcon
          key={c.hex}
          expand
          onClick={() => pick(c.cardColor)}
        >
          <Box h="100%" w="100%" bg={c.hex} bdrs="sm" />
        </AppActionIcon>
      ))}
    </Group>
  );
};
