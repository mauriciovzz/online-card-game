import { Flex, Text } from "@mantine/core";

import { useIsDark } from "@/hooks/useIsDark";

interface Props {
  text: string;
}

export const DisabledOverlay = ({ text }: Props) => {
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
        cursor: "not-allowed",
        backgroundColor: isDark
          ? theme.colors.dark[6]
          : theme.colors.gray[2],
        zIndex: 50,
      })}
    >
      <Text
        size="sm"
        fw={700}
        style={(theme) => ({
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
