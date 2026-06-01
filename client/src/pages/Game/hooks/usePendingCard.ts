import {
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  Card,
  CardColor,
  PlayedCard,
} from "@shared/types";
import type { Items } from "@/types";

interface Props {
  playCard: (color: PlayedCard) => void;
  setItems: Dispatch<SetStateAction<Items>>;
}

export const usePendingCard = ({
  playCard,
  setItems,
}: Props) => {
  const [pending, setPending] = useState<Card | null>(null);
  const [penId, setPenId] = useState<string | null>(null);

  const handlePending = useCallback((card: Card) => {
    setPenId(card.id);
    setPending({ ...card, id: "PENDING" });
  }, []);

  const clearPending = useCallback(() => {
    setPending(null);
    setPenId(null);
  }, []);

  const pickColor = useCallback(
    (color: CardColor) => {
      if (!pending || !penId) return;

      playCard({
        cardId: penId,
        chosenColor: color,
      });

      setItems((prev) => ({
        ...prev,
        cards: prev.cards.filter((c) => c.id !== penId),
        pile: [...prev.pile, { ...pending, id: penId }],
      }));

      clearPending();
    },
    [pending, penId, playCard, setItems, clearPending]
  );

  return {
    pending,
    penId,
    handlePending,
    clearPending,
    pickColor,
  };
};
