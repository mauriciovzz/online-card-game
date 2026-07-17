import {
  Flex,
  Stack,
  Paper,
  Group,
  Box,
  Divider,
  Text,
  ActionIcon,
} from "@mantine/core";
import {
  IconStar,
  IconTrophy,
  IconCrown,
  IconRotateClockwise,
} from "@tabler/icons-react";

import { Label } from "@/components";

import type { Player } from "@shared/types";
import { useResetScores } from "./useResetScores";

const BOARD_PADDING = 12 + 12 + 26;

interface Props {
  players: Player[];
  winnerId: string | null;
  isAdmin: boolean;
}

export const ScoreBoard = ({
  players,
  winnerId,
  isAdmin,
}: Props) => {
  const { resetScores } = useResetScores();

  const hasScores = players.some((p) => p.wins > 0);

  return (
    <Flex
      h="100%"
      w="100%"
      p={BOARD_PADDING}
      align="center"
      justify="center"
    >
      <Stack gap={0} style={{ userSelect: "none" }}>
        <Group gap={0} justify="space-between">
          <Label text={"room.scores"} />

          {isAdmin && (
            <ActionIcon
              size="xs"
              variant="transparent"
              disabled={!hasScores}
              onClick={resetScores}
            >
              <IconRotateClockwise />
            </ActionIcon>
          )}
        </Group>

        <Paper
          w={184 - 5}
          h={147.19 + 14}
          p={6}
          withBorder
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <Stack gap={6}>
            <Group gap={0}>
              <Box h="100%" w={104 - 5} />
              <Flex
                h="100%"
                w={46}
                align="center"
                justify="center"
              >
                <IconStar size={14} />
              </Flex>
              <Flex
                h="100%"
                w={20}
                align="center"
                justify="center"
              >
                <IconTrophy size={14} />
              </Flex>
            </Group>

            <Divider />

            {players
              .sort((a, b) => b.points - a.points)
              .map((p, index) => {
                return (
                  <Stack key={p.id} gap={6}>
                    <Group gap={0}>
                      <Group
                        w={104 - 5}
                        gap={0}
                        justify="space-between"
                      >
                        <Text
                          w={80}
                          size="sm"
                          fw={700}
                          truncate={true}
                        >
                          {p.name}
                        </Text>

                        {p.id === winnerId && (
                          <IconCrown size={14} />
                        )}
                      </Group>
                      <Text
                        w={46}
                        size="xs"
                        inline={true}
                        ta="center"
                      >
                        {p.points}
                      </Text>
                      <Text
                        w={20}
                        size="xs"
                        inline={true}
                        ta="center"
                      >
                        {p.wins}
                      </Text>
                    </Group>

                    {index !== 3 && <Divider />}
                  </Stack>
                );
              })}
          </Stack>
        </Paper>
      </Stack>
    </Flex>
  );
};
