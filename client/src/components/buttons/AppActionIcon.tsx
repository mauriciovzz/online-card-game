import React from "react";
import { ActionIcon, Text } from "@mantine/core";
import type { IconProps } from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  type?: "button" | "submit" | "reset";
  icon: React.ComponentType<IconProps> | string;
  expand?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const AppActionIcon = ({
  type,
  icon,
  expand,
  disabled,
  onClick,
}: Props) => {
  const isMobile = useIsMobile();
  const size = isMobile ? 42 : 36;

  return (
    <ActionIcon
      type={type ?? "button"}
      variant="default"
      h={size}
      w={expand ? "100%" : size}
      flex={expand ? 1 : "none"}
      bdrs="md"
      disabled={disabled}
      onClick={onClick}
    >
      {typeof icon === "string" ? (
        <Text size="sm" fw={700}>
          {icon}
        </Text>
      ) : (
        React.createElement(icon, {
          size: 20,
          stroke: 2,
        })
      )}
    </ActionIcon>
  );
};
