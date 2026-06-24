import { ActionIcon } from "@mantine/core";
import { type IconProps } from "@tabler/icons-react";

interface Props {
  icon: React.FC<IconProps>;
  onClick: () => void;
}

export const CornerButton = ({
  icon: Icon,
  onClick,
}: Props) => {
  return (
    <ActionIcon
      variant="default"
      size="xs"
      pos="absolute"
      top={-8}
      right={-8}
      style={{ zIndex: 10 }}
      onClick={onClick}
    >
      <Icon size={12} />
    </ActionIcon>
  );
};
