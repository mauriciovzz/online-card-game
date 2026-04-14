import { Text, type MantineSize } from "@mantine/core";

interface Props {
  text: string;
  size?: MantineSize;
}
export const Label = ({ text, size }: Props) => {
  return (
    <Text fw={550} size={size} ml={2}>
      {text}
    </Text>
  );
};
