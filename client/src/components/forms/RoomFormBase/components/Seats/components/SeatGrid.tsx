import { Box } from "@mantine/core";

import {
  SEAT_GAP,
  SEAT_HEIGHT,
  SEAT_WIDTH,
} from "../constants/seatSize";

const GRID_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: `repeat(3, ${SEAT_WIDTH.toString()})`,
  gridTemplateRows: `repeat(2, ${SEAT_HEIGHT.toString()})`,
  columnGap: SEAT_GAP,
  rowGap: SEAT_GAP,
  justifyContent: "center",
  alignItems: "center",
};

export function SeatGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box w={309} h={74} style={GRID_STYLE}>
      {children}
    </Box>
  );
}
