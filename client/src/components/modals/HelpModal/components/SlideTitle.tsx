import { Text } from "@mantine/core";

interface Props {
  text: string;
}

export const SlideTitle = ({ text }: Props) => (
  <Text size="lg" fw={700} inline={true} style={{ userSelect: "none" }}>
    {text}
  </Text>
);
