import { Box, Flex, Text } from "@mantine/core";

interface Props {
  text: string;
}

export const AppTitle = ({ text }: Props) => {
  return (
    <Box h={44.19} w="100%">
      <Flex h={44.19} align="center">
        <Text size="34px" truncate="end" fw={700}>
          {text}
        </Text>
      </Flex>
    </Box>
  );
};
