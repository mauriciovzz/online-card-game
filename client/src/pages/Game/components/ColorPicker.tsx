import { ActionIcon, Box, Paper } from "@mantine/core";

import { GAME_COLORS } from "@/constants";

import type { CardColor } from "@shared/types";

interface Props {
  height: number;
  pick: (color: CardColor) => void;
}

export const ColorPicker = ({ height, pick }: Props) => {
  return (
    <Paper
      w="100%"
      h={height}
      pos="absolute"
      top={0}
      style={{ display: "flex", gap: 12 }}
    >
      {GAME_COLORS.map((c) => (
        <ActionIcon
          variant="default"
          key={c.hex}
          h={42}
          flex={1}
          p="sm"
          onClick={() => pick(c.cardColor)}
        >
          <Box h="100%" w="100%" bg={c.hex} bdrs="sm" />
        </ActionIcon>
      ))}
    </Paper>
  );
};
