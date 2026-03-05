import { Card, CardColor, ParsedCard, Room, CardNumber, PlayerState } from "@/types";

const cardColors = ["R", "Y", "G", "B"];

const cardNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const cardTypes = ["S", "R", "T"];
const cardValues = [...cardNumbers, ...cardTypes];

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
  };

  return deck;
};

const refillDeck = (deck: Card[], pile: Card[]) => {
  const topCard = pile.pop();
  const rest = pile.splice(0);
  const shuffled = shuffle(rest);

  deck.push(...shuffled);

  if (topCard) pile.push(topCard);
};

// main functions ---

const create = () => {
  const deck : Card[] = [];

  cardColors.forEach((color) => {
    cardValues.forEach((value) => {
      const card = value + color;
      deck.push(card as Card)
      if(value !== "0") deck.push(card as Card)
    });
    
    deck.push("FC");
    deck.push("WC");
  });

  shuffle(deck);

  const topCardIndex = deck.findIndex(card => /^[0-9]/.test(card));
  const pile = deck.splice(topCardIndex, 1);

  return { deck, pile };
};

const checkCard = (card: string) => {
  if (!cardValues.includes(card[0]) || !cardColors.includes(card[1])) {
    return false
  };

  return true;
};

const checkColor = (color: string | undefined) => {
  if (color) {
    if (cardColors.includes(color)) {
      return true
    };

    return false;
  }

  return true;
};

const parseCard = (card: Card, color?: CardColor): ParsedCard => {
  if (color) {
    if (card === "FC") {
      return { raw: card, type: "DRAW_FOUR", color };
    };

    if (card === "WC") {
      return { raw: card, type: "WILD_CARD", color };
    };    
  }; 

  const cardColor = card[1] as CardColor;

  switch (card[0]) {
    case "S":
      return { raw: card, type: "SKIP", color: cardColor };

    case "R":
      return { raw: card, type: "REVERSE", color: cardColor };

    case "T":
      return { raw: card, type: "DRAW_TWO", color: cardColor };

    default: { 
      const cardNumber = Number(card[0]) as CardNumber;

      return {
        raw: card,
        type: "NUMBER",
        color: cardColor,
        number: cardNumber,
      }; 
    };
  };
};

const draw = (
  player: PlayerState, 
  deck: Card[], 
  pile: Card[],
  numCards: number,
) => { 
  if (numCards > deck.length) {
    refillDeck(deck, pile);
  };

  const cardsDrawn = deck.splice(0, numCards);

  player.hand.push(...cardsDrawn);
  player.calledUno = false;
};

const put = (card: string, hand: Card[], pile: Card[]) => {
  const playedCardIndex = hand.findIndex((c) => c === card);
  const cardToPut = hand.splice(playedCardIndex, 1);
  pile.push(...cardToPut);  
};

const isValidChainMove = (
  topCard: ParsedCard,
  newCard: ParsedCard,
  rules: Room["rules"]
): boolean => {
  if (topCard.type !== "NUMBER" || newCard.type !== "NUMBER") 
    return false;

  if (rules.stair && topCard.number + 1 === newCard.number) 
    return true;

  if (rules.mirror && topCard.raw === newCard.raw) 
    return true;

  return false;
};

const changeColorCard = ["WILD_CARD", "DRAW_FOUR"];

const isValidMove = (topCard: ParsedCard, newCard: ParsedCard) => {
  if (changeColorCard.includes(newCard.type)) {
    return true;
  };

  if (topCard.type === "NUMBER" && newCard.type === "NUMBER") {
    return topCard.number === newCard.number
  };

  return topCard.type === newCard.type || topCard.color === newCard.color;
};

export default { 
  create,
  checkCard,
  checkColor,
  parseCard,
  draw,
  put,
  isValidMove,
  isValidChainMove,
};