import { Text } from "@mantine/core";

interface Props {
  text: string;
  size?: string;
}
export const InputLabel = ({ text, size }: Props) => {
  return (
    <Text fw={550} size={size}>
      {text}
    </Text>
  );
};
