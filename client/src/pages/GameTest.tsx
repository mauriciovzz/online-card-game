import { Flex, Stack, Title } from "@mantine/core";
import { SortableCard } from "./Game/components";
import { MainLayout } from "@/layouts";
import { AppBox, AppButton } from "@/components";
import { useCardsMap } from "@/contexts/CardsContext";
import { useState } from "react";
import {
  DragDropProvider,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { type ReactNode } from "react";
import type { Card, Card as CardType } from "@shared/types";
import { CARD } from "@/constants";
import moveHelper from "@shared/utils/moveHelper";
import { useElementSize } from "@mantine/hooks";

export function Column({
  children,
  id,
  validMove,
}: {
  children: ReactNode;
  id: string;
  validMove: boolean | undefined;
}) {
  const { ref } = useDroppable({
    id,
  });

  const bdColor =
    validMove === undefined
      ? "black"
      : validMove
        ? "green"
        : "red";

  return (
    <Flex
      ref={ref}
      w={CARD.width + 25}
      h={CARD.height + 25}
      bd={`2px dashed ${bdColor}`}
      bdrs={10}
      align="center"
      justify="center"
    >
      <Flex
        w={CARD.width}
        h={CARD.height}
        bdrs={10}
        pos="relative"
      >
        {children}
      </Flex>
    </Flex>
  );
}

type Cont = HTMLDivElement | null;
type CardsType = Record<string, CardType[]>;

const mockCards: CardType[] = [
  {
    id: "1R-0",
    raw: "1R",
    type: "NUMBER",
    number: 1,
    color: "R",
  },
  {
    id: "1R-1",
    raw: "1R",
    type: "NUMBER",
    number: 1,
    color: "R",
  },
  {
    id: "1Y-0",
    raw: "1Y",
    type: "NUMBER",
    number: 1,
    color: "Y",
  },
  {
    id: "1Y-1",
    raw: "1Y",
    type: "NUMBER",
    number: 1,
    color: "Y",
  },
  {
    id: "1G-0",
    raw: "1G",
    type: "NUMBER",
    number: 1,
    color: "G",
  },
  {
    id: "1G-1",
    raw: "1G",
    type: "NUMBER",
    number: 1,
    color: "G",
  },
  {
    id: "1B-0",
    raw: "1B",
    type: "NUMBER",
    number: 1,
    color: "B",
  },
  {
    id: "1B-1",
    raw: "1B",
    type: "NUMBER",
    number: 1,
    color: "B",
  },
  {
    id: "2R-0",
    raw: "2R",
    type: "NUMBER",
    number: 2,
    color: "R",
  },
  {
    id: "2R-2",
    raw: "2R",
    type: "NUMBER",
    number: 2,
    color: "R",
  },
  {
    id: "2Y-0",
    raw: "2Y",
    type: "NUMBER",
    number: 2,
    color: "Y",
  },
  {
    id: "2Y-2",
    raw: "2Y",
    type: "NUMBER",
    number: 2,
    color: "Y",
  },
  {
    id: "2G-0",
    raw: "2G",
    type: "NUMBER",
    number: 2,
    color: "G",
  },
  {
    id: "2G-2",
    raw: "2G",
    type: "NUMBER",
    number: 2,
    color: "G",
  },
  {
    id: "2B-0",
    raw: "2B",
    type: "NUMBER",
    number: 2,
    color: "B",
  },
  {
    id: "2B-2",
    raw: "2B",
    type: "NUMBER",
    number: 2,
    color: "B",
  },
];

const mockTopCard: CardType[] = [
  {
    id: "3Y-2",
    raw: "3Y",
    type: "NUMBER",
    number: 3,
    color: "Y",
  },
];

export const GameTest = () => {
  const { cardsMap } = useCardsMap();
  const { ref, width } = useElementSize();

  const [container, setContainer] = useState<Cont>(null);
  const [validMove, setValidMove] = useState<
    boolean | undefined
  >(undefined);

  const [items, setItems] = useState<CardsType>({
    cards: mockCards,
    pile: mockTopCard,
  });

  const handleDragOver = (event: DragOverEvent) => {
    const data = event.operation.source?.data;
    const card = data?.card as Card | undefined;

    const targetId = event.operation.target?.id;

    if (targetId === "pile") {
      if (!card) return;

      const isValid = moveHelper.checkMove(
        items.pile[items.pile.length - 1],
        card
      );

      setValidMove(isValid);
    } else {
      setItems((prev) => {
        return {
          ...prev,
          cards: move(prev.cards, event),
        };
      });

      setValidMove(undefined);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const sourceId = event.operation.source?.id;

    if (validMove && sourceId) {
      setItems((items) => {
        const newArray = move(items, event);

        const index = newArray.pile.findIndex(
          (item) => item.id === sourceId
        );

        newArray.pile.push(
          newArray.pile.splice(index, 1)[0]
        );

        return newArray;
      });
    }

    setItems((prev) => move(prev, event));
    setValidMove(undefined);
  };

  const over = Math.ceil((7 * CARD.width - width) / 6);

  const returnCard = () => {
    setItems((prev) => {
      const last = prev.pile.pop();

      return {
        ...prev,
        cards: [...prev.cards, ...(last ? [last] : [])],
      };
    });
  };

  console.log(items.pile, items.cards);

  return (
    <MainLayout>
      <Title w="100%">Besties</Title>
      <AppBox ref={setContainer}>
        <DragDropProvider
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Stack flex={1} h="100%" p="sm">
            <Column
              key={"pile"}
              id={"pile"}
              validMove={validMove}
            >
              {items.pile.map((card, index) => (
                <SortableCard
                  key={card.id}
                  index={index}
                  card={card}
                  svg={cardsMap[card.raw]}
                  styles={{
                    zIndex: index,
                  }}
                  container={container}
                  locked
                />
              ))}
            </Column>
            <Flex
              w="100%"
              h={CARD.height + 50 + 25}
              bg="gray"
              bdrs={10}
              align="center"
              justify="center"
              p="sm"
            >
              <Flex
                ref={ref}
                w="100%"
                h="100%"
                pos="relative"
              >
                {items.cards.map((card, index) => {
                  const col = index % 7;
                  const row = Math.floor(index / 7);

                  return (
                    <SortableCard
                      key={card.id}
                      index={index}
                      card={card}
                      svg={cardsMap[card.raw]}
                      styles={{
                        position: "absolute",
                        left: col * (CARD.width - over),
                        top: row * 25,
                        zIndex: index,
                      }}
                      container={container}
                    />
                  );
                })}
              </Flex>
            </Flex>
            <AppButton
              text="return"
              expand
              onClick={returnCard}
            />
          </Stack>
        </DragDropProvider>
      </AppBox>
    </MainLayout>
  );
};
