import type { ReactNode } from "react";
import {
  Group,
  Text,
  type MantineSize,
} from "@mantine/core";

interface Props {
  text: string;
  error?: ReactNode;
  size?: MantineSize;
}

export const Label = ({ text, error, size }: Props) => {
  return (
    <Group>
      <Text fw={550} size={size} ml={2}>
        {text}
      </Text>
      {error && (
        <Text flex={1} c="red" size="xs" ta="right">
          {error}
        </Text>
      )}
    </Group>
  );
};
