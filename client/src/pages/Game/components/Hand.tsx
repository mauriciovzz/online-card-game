import { Flex } from "@mantine/core";

import { CARD } from "@/constants";
import { useCardsMap } from "@/contexts/CardsContext";
import { SortableCard } from "./SortableCard";

import type { Card } from "@shared/types";
import { useMemo } from "react";

const LAYOUT = {
  cardsPerRow: 7,
  rowOffset: 25,
} as const;

interface Props {
  width: number;
  cards: Card[];
  pendingCardId: string | null;
  container: HTMLDivElement | null;
}

export const Hand = ({
  width,
  cards,
  pendingCardId,
  container,
}: Props) => {
  const { cardsMap } = useCardsMap();

  const { overlapX, height } = useMemo(() => {
    const totalCardWidth = LAYOUT.cardsPerRow * CARD.width;
    const spaceLeft = totalCardWidth - width;
    const spacesBetweenCards = LAYOUT.cardsPerRow - 1;

    const overlapX = Math.max(
      0,
      Math.ceil(spaceLeft / spacesBetweenCards)
    );

    const rows = Math.ceil(
      cards.length / LAYOUT.cardsPerRow
    );

    const height =
      CARD.height + (rows - 1) * LAYOUT.rowOffset;

    return {
      overlapX,
      height,
    };
  }, [width, cards.length]);

  const positionedCards = useMemo(() => {
    return cards.map((card, index) => {
      const column = index % LAYOUT.cardsPerRow;
      const row = Math.floor(index / LAYOUT.cardsPerRow);

      return {
        card,
        index,

        top: row * LAYOUT.rowOffset,
        left: column * (CARD.width - overlapX),
        isPreview: card.id === pendingCardId,
      };
    });
  }, [cards, overlapX, pendingCardId]);

  return (
    <Flex
      w={width}
      h={height}
      pos="absolute"
      bottom={26 + 12}
    >
      <Flex w="100%" h="100%" pos="relative">
        {positionedCards.map(
          ({ index, card, top, left, isPreview }) => {
            return (
              <SortableCard
                key={card.id}
                index={index}
                card={card}
                svg={cardsMap[card.raw]}
                styles={{
                  top,
                  left,
                  opacity: isPreview ? 0.4 : 1,
                }}
                container={container}
              />
            );
          }
        )}
      </Flex>
    </Flex>
  );
};
