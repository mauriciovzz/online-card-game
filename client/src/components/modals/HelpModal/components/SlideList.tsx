import { List } from "@mantine/core";

interface Props {
  items: string[];
}

export const SlideList = ({ items }: Props) => (
  <List size="sm">
    {items.map((item) => (
      <List.Item key={item}>{item}</List.Item>
    ))}
  </List>
);
