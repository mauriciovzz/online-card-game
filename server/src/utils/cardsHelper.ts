import {
  Card,
  CardColor,
  ParsedCard,
  Room,
  CardNumber,
  PlayerState,
  PlayedCard,
  SocketRes,
} from "@/types";

const cardColors = ["R", "Y", "G", "B"];
const cardNumbers = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];
const cardTypes = ["S", "R", "T"];
const cardValues = [...cardNumbers, ...cardTypes];

// ok
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

// ok
const refillDeck = (deck: Card[], pile: Card[]) => {
  const topCard = pile.pop();
  const rest = pile.splice(0);

  deck.push(...shuffle(rest));
  if (topCard) pile.push(topCard);
};

// ----------

// ok
const createDeck = () => {
  const deck: Card[] = [];

  for (const color of cardColors) {
    for (const value of cardValues) {
      const card = `${value}${color}` as Card;

      deck.push(card);

      if (value !== "0") {
        deck.push(card);
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push("FC", "WC");
  }

  shuffle(deck);

  const checkCard = (card: Card) => /^[0-9]/.test(card);
  const topCardIndex = deck.findIndex(checkCard);
  const pile = deck.splice(topCardIndex, 1);

  return { deck, pile };
};

// ok
const cardRegex = /^(?:([0-9SRT])([RYGB])|(FC|WC))$/;

const parseCard = ({
  playedCard,
  chosenColor,
}: PlayedCard): SocketRes<ParsedCard> => {
  const match = cardRegex.exec(playedCard);

  if (!match) {
    return { success: false, error: "INVALID_CARD" };
  }

  const [raw, value, color, wildType] = match;

  // Wild / Draw Four
  if (wildType) {
    if (!chosenColor) {
      return { success: false, error: "COLOR_MISSING" };
    }

    if (!cardColors.includes(chosenColor as CardColor)) {
      return { success: false, error: "INVALID_COLOR" };
    }

    return {
      success: true,
      data:
        wildType === "WC"
          ? {
              raw: "WC",
              type: "WILD_CARD",
              color: chosenColor as CardColor,
            }
          : {
              raw: "FC",
              type: "DRAW_FOUR",
              color: chosenColor as CardColor,
            },
    };
  }

  // Colored card
  switch (value) {
    case "S":
      return {
        success: true,
        data: {
          raw: raw as Card,
          type: "SKIP",
          color: color as CardColor,
        },
      };

    case "R":
      return {
        success: true,
        data: {
          raw: raw as Card,
          type: "REVERSE",
          color: color as CardColor,
        },
      };

    case "T":
      return {
        success: true,
        data: {
          raw: raw as Card,
          type: "DRAW_TWO",
          color: color as CardColor,
        },
      };

    default:
      return {
        success: true,
        data: {
          raw: raw as Card,
          type: "NUMBER",
          number: Number(value) as CardNumber,
          color: color as CardColor,
        },
      };
  }
};

// ok
const draw = (
  player: PlayerState,
  numCards: number,
  deck: Card[],
  pile: Card[]
) => {
  if (numCards > deck.length) {
    refillDeck(deck, pile);
  }

  const cardsDrawn = deck.splice(0, numCards);

  player.hand.push(...cardsDrawn);
  player.calledUno = false;
};

// ok
const put = (card: Card, hand: Card[], pile: Card[]) => {
  const playedCardIndex = hand.findIndex((c) => c === card);
  const cardToPut = hand.splice(playedCardIndex, 1);
  pile.push(...cardToPut);
};

// ok
const checkMove = (
  topCard: ParsedCard,
  newCard: ParsedCard
) => {
  const { type: tType, color: tColor } = topCard;
  const { raw: nRaw, type: nType, color: nColor } = newCard;

  if (["WC", "FC"].includes(nRaw)) {
    return true;
  }

  if (tType === "NUMBER" && nType === "NUMBER") {
    return topCard.number === newCard.number;
  }

  return tType === nType || tColor === nColor;
};

const checkChainMove = (
  topCard: ParsedCard,
  newCard: ParsedCard,
  rules: Room["rules"]
): boolean => {
  const { type: tType } = topCard;
  const { type: nType } = newCard;

  if (tType !== "NUMBER" || nType !== "NUMBER")
    return false;

  if (rules.stair && topCard.number + 1 === newCard.number)
    return true;

  if (rules.mirror && topCard.raw === newCard.raw)
    return true;

  return false;
};

export default {
  createDeck,
  parseCard,
  draw,
  put,
  checkMove,
  checkChainMove,
};
