import { List } from "@mantine/core";

interface Props {
  ordered?: boolean;
  items: string[];
}

export const SlideList = ({ ordered, items }: Props) => (
  <List
    size="sm"
    type={ordered ? "ordered" : undefined}
    style={{ userSelect: "none" }}
  >
    {items.map((item) => (
      <List.Item key={item}>{item}</List.Item>
    ))}
  </List>
);
