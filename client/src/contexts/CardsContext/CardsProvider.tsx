import { type ReactNode, useState, useEffect } from "react";

import { CardsContext } from "./CardsContext";

import type { SvgCardsMap } from "@/types";
import { CARD } from "@/constants";

const extractCoordinates = (group: Element) => {
  const rect = group.querySelector("rect");

  return {
    x: rect ? parseFloat(rect.getAttribute("x") ?? "0") : 0,

    y: rect ? parseFloat(rect.getAttribute("y") ?? "0") : 0,
  };
};

const transformGroup = (group: Element) => {
  const cloned = group.cloneNode(true) as Element;

  cloned.removeAttribute("transform");

  const id = cloned.getAttribute("id") ?? "";

  let scale = CARD.scale;

  // special case
  if (id === "WC") {
    scale *= 0.25;
  }

  const { x, y } = extractCoordinates(cloned);

  const serializer = new XMLSerializer();

  const inner = serializer.serializeToString(cloned);

  return `
    <g transform="translate(${(-x * scale).toString()}, ${(-y * scale).toString()})">
      <g transform="scale(${scale.toString()})">
        ${inner}
      </g>
    </g>
  `;
};

interface Props {
  children: ReactNode;
}

export const CardsProvider = ({ children }: Props) => {
  const [cardsMap, setCardsMap] = useState<SvgCardsMap>({});

  const [cardsLoading, setCardsLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const res = await fetch("/cards.svg");

        const text = await res.text();

        const parser = new DOMParser();

        const doc = parser.parseFromString(text, "image/svg+xml");

        const groups = doc.querySelectorAll("g[id]");

        const map: SvgCardsMap = {};

        groups.forEach((group) => {
          if (group.id.length <= 3) {
            map[group.id] = transformGroup(group);
          }
        });

        setCardsMap(map);
      } finally {
        setCardsLoading(false);
      }
    };

    void loadCards();
  }, []);

  return (
    <CardsContext.Provider value={{ cardsMap, cardsLoading }}>
      {children}
    </CardsContext.Provider>
  );
};
