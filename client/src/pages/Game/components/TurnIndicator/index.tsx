import {
  Stack,
  Paper,
  Flex,
  Group,
  Divider,
  Text,
} from "@mantine/core";
import { t } from "i18next";

import { useIsMobile } from "@/hooks";
import { Timer } from "./Timer";

interface Props {
  player?: string;
  startTime: number;
  turnDuration: string;
}

export const TurnIndicator = (props: Props) => {
  const { player, startTime, turnDuration } = props;

  const isMobile = useIsMobile();
  const size = isMobile ? 42 : 36;

  return (
    <Stack
      flex={1}
      miw={0}
      h="100%"
      gap={0}
      style={{ userSelect: "none" }}
    >
      <Paper h={size} w="100%" withBorder>
        <Flex
          w="100%"
          h="100%"
          miw={0}
          align="center"
          justify="center"
        >
          <Group h={20} w="100%" gap={0} wrap="nowrap">
            <Flex
              h={20}
              flex={1}
              px={7}
              miw={0}
              justify="center"
              align="center"
            >
              <Text truncate="end" inline={true}>
                {player ?? t("game.myTurn")}
              </Text>
            </Flex>

            <Divider orientation="vertical" />

            <Timer
              size={size}
              turnStart={startTime}
              turnDuration={turnDuration}
            />
          </Group>
        </Flex>
      </Paper>
    </Stack>
  );
};
