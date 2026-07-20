import { CARD_COLORS, CARD_NUMBERS, CARD_TYPES } from "@shared/constants";
import {
  Card,
  CardColor,
  CardType,
  Game,
  PlayerState,
  HandState,
} from "@shared/types";

const shuffle = (deck: Card[]) => {
  let currentIndex = deck.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[currentIndex],
    ];
  }

  return deck;
};

const refillDeck = (deck: Card[], pile: Card[]) => {
  const top = pile.pop();
  const rest = pile.splice(0);

  deck.push(...shuffle(rest));
  if (top) pile.push(top);
};

// ------------------------------------------------------------

const createDeck = () => {
  const deck: Card[] = [];

  for (const color of CARD_COLORS) {
    for (const number of CARD_NUMBERS) {
      const raw = number.toString() + color;

      const card = {
        raw,
        type: "NUMBER" as CardType,
        number,
        color: color as CardColor,
      };

      for (let i = 1; i <= 2; i++) {
        deck.push({
          id: raw + "-" + i.toString(),
          ...card,
        });

        if (number === 0) break;
      }
    }

    for (const value of CARD_TYPES) {
      const raw = value + color;

      const getCardType = (val: string): "SKIP" | "REVERSE" | "DRAW_TWO" => {
        switch (val) {
          case "S":
            return "SKIP";
          case "R":
            return "REVERSE";
          default:
            return "DRAW_TWO";
        }
      };

      for (let i = 1; i <= 2; i++) {
        deck.push({
          id: raw + "-" + i.toString(),
          raw,
          type: getCardType(value),
          color: color as CardColor,
        });
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push({
      id: "FC-" + i.toString(),
      raw: "FC",
      type: "DRAW_FOUR",
      color: "W",
    });

    deck.push({
      id: "WC-" + i.toString(),
      raw: "WC",
      type: "WILD_CARD",
      color: "W",
    });
  }

  shuffle(deck);

  const findCard = (card: Card) => card.type === "NUMBER";
  const topCardIndex = deck.findIndex(findCard);

  const pile = deck.splice(topCardIndex, 1);

  return { deck, pile };
};

const draw = (state: PlayerState, numCards: number, game: Game): HandState => {
  const { deck, pile } = game;

  if (numCards > deck.length) {
    refillDeck(deck, pile);
  }

  const cardsDrawn = deck.splice(0, numCards);

  state.cards.push(...cardsDrawn);
  state.calledUno = false;

  const updatedHand = {
    cards: cardsDrawn,
    calledUno: state.calledUno,
  };

  return updatedHand;
};

export default { createDeck, draw };
