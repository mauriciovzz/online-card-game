import { Box, Flex, Text } from "@mantine/core";

interface Props {
  text: string;
}

export const AppTitle = ({ text }: Props) => {
  return (
    <Box h={44.19} style={{ userSelect: "none" }}>
      <Flex h={44.19} align="center">
        <Text
          truncate="end"
          fw={700}
          style={{ fontSize: 34, lineHeight: 2 }}
        >
          {text}
        </Text>
      </Flex>
    </Box>
  );
};
