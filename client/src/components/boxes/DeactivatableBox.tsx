import { Flex, Stack, Text } from "@mantine/core";

import { useIsDark } from "@/hooks/useIsDark";
import { useThemeColor } from "@/hooks/useThemeColor";

const DisabledOverlay = ({ text }: { text: string }) => {
  const isDark = useIsDark();

  return (
    <Flex
      w="100%"
      h="100%"
      align="center"
      justify="center"
      pos="absolute"
      style={(theme) => ({
        inset: 0,
        backgroundColor: isDark
          ? theme.colors.dark[6]
          : theme.colors.gray[2],
        zIndex: 50,
      })}
    >
      <Text
        fw={700}
        style={(theme) => ({
          userSelect: "none",
          color: isDark
            ? theme.colors.dark[3]
            : theme.colors.gray[5],
        })}
      >
        {text}
      </Text>
    </Flex>
  );
};

interface Props {
  disabledText: string;
  disabled: boolean;
  children: React.ReactNode;
}

export const DeactivatableBox = ({
  disabledText,
  disabled,
  children,
}: Props) => {
  const isDark = useIsDark();
  const themeColor = useThemeColor();

  return (
    <Stack
      w="100%"
      h="100%"
      gap={0}
      bdrs="md"
      pos="relative"
      style={(theme) => {
        const borderColor = disabled
          ? isDark
            ? theme.colors.dark[6]
            : theme.colors.gray[2]
          : themeColor;

        return {
          border: `1px solid ${borderColor}`,
          overflow: "hidden",
        };
      }}
    >
      {children}

      {disabled && <DisabledOverlay text={disabledText} />}
    </Stack>
  );
};
