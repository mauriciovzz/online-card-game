import { Box } from "@mantine/core";
import { useSortable } from "@dnd-kit/react/sortable";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";

import { CARD } from "@/constants";
import { CardItem } from "./CardItem";

import type { Card } from "@shared/types";

interface Props {
  index: number;
  card: Card;
  svg: string;
  styles?: React.CSSProperties;
  locked?: boolean;
  container: HTMLDivElement | null;
}

export const SortableCard = ({
  index,
  card,
  svg,
  styles,
  locked,
  container,
}: Props) => {
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    data: { card },
    disabled: locked,
    modifiers: [
      RestrictToElement.configure({
        element: container,
      }),
    ],
  });

  return (
    <Box
      ref={ref}
      h={CARD.height}
      w={CARD.width}
      pos="absolute"
      style={{
        cursor: locked
          ? undefined
          : isDragging
            ? "grabbing"
            : "grab",
        touchAction: "none",
        zIndex: index,
        ...styles,
      }}
    >
      <CardItem svg={svg} />
    </Box>
  );
};
