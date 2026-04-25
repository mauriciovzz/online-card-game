import type React from "react";
import { UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { useIsDark, useThemeColor } from "@/hooks";

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
  const themeColor = useThemeColor();

  return (
    <UnstyledButton
      ref={ref}
      w="100%"
      h={54}
      px={12}
      style={(theme) => {
        const normalBg = isDark
          ? theme.colors.dark[6]
          : "white";

        const hoverBg = isDark
          ? theme.colors.dark[5]
          : theme.colors.gray[0];

        return {
          borderBottom: `1px solid ${themeColor}`,
          backgroundColor: hovered ? hoverBg : normalBg,
        };
      }}
      onClick={onClick}
    >
      {children}
    </UnstyledButton>
  );
};
