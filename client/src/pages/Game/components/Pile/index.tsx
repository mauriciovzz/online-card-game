import { Flex } from "@mantine/core";
import { useDroppable } from "@dnd-kit/react";

import { CARD } from "@/constants";
import { useCardsMap } from "@/contexts/CardsContext";
import { SortableCard } from "../SortableCard";
import { DirectionArrows } from "./DirectionArrows";
import { CardPile } from "./CardPile";

import type { Card, GameState } from "@shared/types";

interface Props {
  width: number;
  pile: Card[];
  pendingCard: Card | null | undefined;
  validMove: boolean | null;
  game: GameState;
  container: HTMLDivElement | null;
}

export const Pile = ({
  width,
  pile,
  pendingCard,
  validMove,
  game,
  container,
}: Props) => {
  const { cardsMap } = useCardsMap();

  const { ref } = useDroppable({
    id: "pile",
  });

  const currentPile = [
    ...pile,
    ...(pendingCard ? [pendingCard] : []),
  ];

  return (
    <Flex
      w={width}
      h={width}
      align="center"
      justify="center"
      pos="relative"
    >
      <CardPile ref={ref} validMove={validMove}>
        <Flex w={CARD.width} h={CARD.height}>
          {currentPile.map((card, index) => (
            <SortableCard
              key={card.id}
              index={index}
              card={card}
              svg={cardsMap[card.raw]}
              locked
              container={container}
            />
          ))}

          {pendingCard && (
            <SortableCard
              index={currentPile.length}
              card={pendingCard}
              svg={cardsMap[pendingCard.raw]}
              locked
              container={container}
            />
          )}
        </Flex>

        <DirectionArrows
          direction={game.direction}
          color={game.topCard.color}
        />
      </CardPile>
    </Flex>
  );
};
