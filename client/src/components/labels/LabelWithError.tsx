import type { ReactNode } from "react";
import {
  Group,
  Text,
  type MantineSize,
} from "@mantine/core";

import { Label } from "./Label";

interface Props {
  text: string;
  error: ReactNode;
  size?: MantineSize;
}

export const LabelWithError = ({
  text,
  error,
  size,
}: Props) => {
  return (
    <Group>
      <Label text={text} size={size} />
      <Text flex={1} c="red" size="xs" ta="right">
        {error}
      </Text>
    </Group>
  );
};
