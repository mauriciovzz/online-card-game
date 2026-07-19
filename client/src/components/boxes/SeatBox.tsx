import type { ReactNode } from "react";
import { Paper } from "@mantine/core";

import type { BoardPosition } from "@/types";

const BOARD_POSITIONS = {
  bottom: { bottom: 12 },
  left: { left: -98, transform: "rotate(-90deg)" },
  top: { top: 12 },
  right: { right: -98, transform: "rotate(90deg)" },
} satisfies Record<BoardPosition, React.CSSProperties>;

interface Props {
  pos?: BoardPosition;
  borderColor?: string;
  children?: ReactNode;
}

export const SeatBox = ({ pos, borderColor, children }: Props) => (
  <Paper
    w={249}
    h={26}
    p={5}
    withBorder={borderColor ? false : true}
    bdrs="md"
    pos="absolute"
    style={{
      userSelect: "none",
      gap: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...(pos ? { position: "absolute", ...BOARD_POSITIONS[pos] } : {}),
      ...(borderColor ? { border: `1px solid ${borderColor}` } : {}),
    }}
  >
    {children}
  </Paper>
);
