import type React from "react";
import { UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { useIsDark } from "@/hooks/useIsDark";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

export const ItemButton = ({
  onClick,
  children,
}: Props) => {
  const { hovered, ref } = useHover();
  const isDark = useIsDark();

  return (
    <UnstyledButton
      w="100%"
      p={10}
      style={(theme) => {
        const borderColor = isDark
          ? theme.colors.dark[4]
          : theme.colors.gray[3];

        const normalBg = isDark
          ? theme.colors.dark[6]
          : "white";

        const hoverBg = isDark
          ? theme.colors.dark[5]
          : theme.colors.gray[0];

        return {
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: hovered ? hoverBg : normalBg,
        };
      }}
      ref={ref}
      onClick={onClick}
    >
      {children}
    </UnstyledButton>
  );
};
