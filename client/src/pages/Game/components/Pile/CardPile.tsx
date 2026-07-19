import { useMemo, type ReactNode } from "react";
import { Flex } from "@mantine/core";

import { CARD } from "@/constants";
import { useThemeColor } from "@/hooks";

interface Props {
  ref: (element: Element | null) => void;
  validMove: boolean | null;
  children: ReactNode;
}

export const CardPile = ({ ref, validMove, children }: Props) => {
  const themeColor = useThemeColor();

  const borderColor = useMemo(() => {
    return validMove == null ? themeColor : validMove ? "green" : "red";
  }, [themeColor, validMove]);

  return (
    <Flex
      ref={ref}
      w={CARD.width + 25}
      h={CARD.height + 25}
      bd={`2px dashed ${borderColor}`}
      bdrs="md"
      align="center"
      justify="center"
      pos="relative"
    >
      {children}
    </Flex>
  );
};
