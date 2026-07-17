import { Flex, Text, Loader } from "@mantine/core";

interface Props {
  text?: string;
  color: string;
}

export const PlayerContent = ({ text, color }: Props) => {
  return (
    <Flex
      flex={1}
      h="100%"
      bg={color}
      bdrs="sm"
      align="center"
      justify="center"
    >
      {text ? (
        <Text
          size="sm"
          fw={700}
          c="white"
          ta="center"
          inline={true}
          truncate="end"
        >
          {text}
        </Text>
      ) : (
        <Loader size="sm" color="white" type="dots" />
      )}
    </Flex>
  );
};
