import { Text } from "@mantine/core";

interface Props {
  text: string;
}

export const SlideSubTitle = ({ text }: Props) => (
  <Text size="sm" fw={550} inline={true} style={{ userSelect: "none" }}>
    {text}
  </Text>
);
