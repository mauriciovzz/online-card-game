import { Text } from "@mantine/core";

interface Props {
  text: string;
}

export const SlideParagraph = ({ text }: Props) => (
  <Text
    size="sm"
    ta="justify"
    textWrap="pretty"
    inline={true}
  >
    {text}
  </Text>
);
