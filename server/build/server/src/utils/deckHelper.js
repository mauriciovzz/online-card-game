"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../../shared/constants");
const shuffle = (deck) => {
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
const refillDeck = (deck, pile) => {
    const top = pile.pop();
    const rest = pile.splice(0);
    deck.push(...shuffle(rest));
    if (top)
        pile.push(top);
};
// ------------------------------------------------------------
const createDeck = () => {
    const deck = [];
    for (const color of constants_1.CARD_COLORS) {
        for (const number of constants_1.CARD_NUMBERS) {
            const raw = number.toString() + color;
            const card = {
                raw,
                type: "NUMBER",
                number,
                color: color,
            };
            for (let i = 1; i <= 2; i++) {
                deck.push(Object.assign({ id: raw + "-" + i.toString() }, card));
                if (number === 0)
                    break;
            }
        }
        for (const value of constants_1.CARD_TYPES) {
            const raw = value + color;
            const getCardType = (val) => {
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
                    color: color,
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
    const findCard = (card) => card.type === "NUMBER";
    const topCardIndex = deck.findIndex(findCard);
    const pile = deck.splice(topCardIndex, 1);
    return { deck, pile };
};
const draw = (state, numCards, game) => {
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
exports.default = { createDeck, draw };
