import { useState } from "react";
import {
  ActionIcon,
  Box,
  Flex,
  Group,
} from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";

import { useThemeColor } from "@/hooks";
import type { PlayerType } from "@shared/types";
import { PLAYER_TYPES } from "@/constants";

interface Props {
  height: number;
  simple?: boolean;
  onSelect: (type: PlayerType) => void;
}

export const AddSeatCard = ({
  height,
  simple,
  onSelect,
}: Props) => {
  const themeColor = useThemeColor();

  const [opened, setOpened] = useState(false);

  return (
    <Box w="100%" pos="relative">
      <Flex
        w="100%"
        h={height}
        justify="center"
        align="center"
        bd={`1px solid ${themeColor}`}
        bdrs="8px"
        p={4}
        pos="relative"
        style={{ userSelect: "none" }}
      >
        {!opened ? (
          <ActionIcon
            variant="subtle"
            onClick={
              simple
                ? () => onSelect("human")
                : () => setOpened(true)
            }
          >
            <IconPlus size={20} />
          </ActionIcon>
        ) : (
          <Group gap={4} w="100%">
            {PLAYER_TYPES.map(({ key, icon: Icon }) => (
              <ActionIcon
                key={key}
                flex={1}
                variant="subtle"
                onClick={() => onSelect(key)}
              >
                <Icon size={20} />
              </ActionIcon>
            ))}
          </Group>
        )}
      </Flex>

      {opened && (
        <ActionIcon
          variant="default"
          size="xs"
          pos="absolute"
          top={-8}
          right={-8}
          onClick={() => setOpened(false)}
        >
          <IconMinus size={12} />
        </ActionIcon>
      )}
    </Box>
  );
};
