import { useEffect, useState } from "react";

export type SvgCardsMap = Record<string, string>;

export function useSvgCards() {
  const [cards, setCards] = useState<SvgCardsMap>({});

  useEffect(() => {
    void fetch("/cards.svg")
      .then((res) => res.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          text,
          "image/svg+xml"
        );
        const groupEls = doc.querySelectorAll("g[id]");
        const map: SvgCardsMap = {};

        groupEls.forEach((g) => {
          if (g.id.length <= 3) {
            map[g.id] = g.outerHTML;
          }
        });

        setCards(map);
      });
  }, []);

  return cards;
}
