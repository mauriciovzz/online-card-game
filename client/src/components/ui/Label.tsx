import { useTranslation } from "react-i18next";
import {
  Group,
  Text,
  type MantineSize,
} from "@mantine/core";
import type { ReactNode } from "react";

interface Props {
  size?: MantineSize;
  text: string;
  error?: ReactNode;
}

export const Label = ({ size, text, error }: Props) => {
  const { t } = useTranslation();

  return (
    <Group>
      <Text fw={550} size={size} ml={2}>
        {t(text)}
      </Text>
      {error && (
        <Text flex={1} c="red" size="xs" ta="right">
          {error}
        </Text>
      )}
    </Group>
  );
};
