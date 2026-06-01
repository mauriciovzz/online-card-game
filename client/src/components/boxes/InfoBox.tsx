import { memo, type ReactNode } from "react";
import { Flex, Paper, Stack } from "@mantine/core";

import { useIsMobile } from "@/hooks";
import { Label } from "@/components";

interface Props {
  text?: string;
  info: string | ReactNode;
}

export const InfoBox = memo(({ text, info }: Props) => {
  const size = useIsMobile() ? 42 : 36;

  return (
    <Stack flex={1} gap={0} style={{ userSelect: "none" }}>
      {text && <Label text={text} />}
      <Paper h={size} withBorder bdrs="md">
        <Flex
          h="100%"
          w="100%"
          justify="center"
          align="center"
        >
          {info}
        </Flex>
      </Paper>
    </Stack>
  );
});
