import React from "react";
import { ActionIcon } from "@mantine/core";

import { useIsMobile } from "@/hooks";

interface Props {
  type?: "button" | "submit" | "reset";
  expand?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const AppActionIcon = ({
  type = "button",
  expand,
  disabled,
  onClick,
  children,
}: Props) => {
  const isMobile = useIsMobile();
  const size = isMobile ? 42 : 36;

  return (
    <ActionIcon
      type={type}
      variant="default"
      h={size}
      w={expand ? "100%" : size}
      flex={expand ? 1 : "none"}
      bdrs="md"
      disabled={disabled}
      onClick={onClick}
      p={isMobile ? 11 : 7}
    >
      {children}
    </ActionIcon>
  );
};
