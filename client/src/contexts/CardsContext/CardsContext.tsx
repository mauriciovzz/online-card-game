import { createContext, useContext } from "react";

import type { SvgCardsMap } from "@/types";

interface CardsContextTypes {
  cardsMap: SvgCardsMap;
  cardsLoading: boolean;
}

export const CardsContext = createContext<
  CardsContextTypes | undefined
>(undefined);

export const useCardsMap = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error(
      "useCardsMap must be used within a CardsProvider"
    );
  }
  return context;
};
