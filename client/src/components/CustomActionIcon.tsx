import { ActionIcon } from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";

interface Props {
  icon: React.ComponentType<IconProps>;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const CustomActionIcon = ({
  icon: Icon,
  type,
  onClick,
}: Props) => {
  return (
    <ActionIcon
      size={36}
      variant="default"
      onClick={onClick}
      bdrs="md"
      type={type ?? "button"}
    >
      <Icon size={19} stroke={2} />
    </ActionIcon>
  );
};
