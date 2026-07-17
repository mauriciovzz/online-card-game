"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moveHelper_1 = __importDefault(require("../../../../shared/utils/moveHelper"));
const countColor = (player, color) => player.cards.filter((c) => c.color === color).length;
const mirrorBonus = (player, card) => {
    if (card.type !== "NUMBER") {
        return 0;
    }
    const count = player.cards.filter((c) => c.id !== card.id && c.raw === card.raw).length;
    return count * 50;
};
const stairBonus = (player, card) => {
    if (card.type !== "NUMBER") {
        return 0;
    }
    const next = player.cards.find((c) => c.type === "NUMBER" && c.number === card.number + 1);
    return next ? 30 : 0;
};
const chooseColor = (player) => {
    const counts = {
        R: 0,
        B: 0,
        G: 0,
        Y: 0,
    };
    for (const card of player.cards) {
        if (card.color !== "W" && card.color in counts) {
            counts[card.color]++;
        }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
};
const scoreCard = (player, card) => {
    const cardsLeft = player.cards.length;
    let score = 0;
    switch (card.type) {
        case "NUMBER":
            score = 100;
            break;
        case "REVERSE":
            score = 80;
            break;
        case "SKIP":
            score = 75;
            break;
        case "DRAW_TWO":
            score = 70;
            break;
        case "WILD_CARD":
            score = cardsLeft <= 3 ? 90 : 20;
            break;
        case "DRAW_FOUR":
            score = cardsLeft <= 3 ? 95 : 10;
            break;
    }
    if (card.color !== "W") {
        score += countColor(player, card.color);
    }
    score += mirrorBonus(player, card);
    score += stairBonus(player, card);
    return score;
};
// ----------
const getMove = (game, player) => {
    let playable;
    if (player.cards.length === 1 &&
        player.cards[0].type !== "NUMBER") {
        return null;
    }
    if (game.currEffect) {
        playable = player.cards.filter((c) => c.type === game.currEffect);
    }
    else {
        playable = player.cards.filter((card) => moveHelper_1.default.checkMove(game.topCard, card));
    }
    if (playable.length === 0) {
        return null;
    }
    playable.sort((a, b) => scoreCard(player, b) - scoreCard(player, a));
    const card = playable[0];
    return {
        card,
        chosenColor: card.type === "WILD_CARD" || card.type === "DRAW_FOUR"
            ? chooseColor(player)
            : undefined,
    };
};
const getChainMove = (turnData) => {
    const { room, game, state } = turnData;
    const playable = state.cards.filter((card) => moveHelper_1.default.checkChainMove(game.topCard, card, room.rules));
    if (playable.length === 0) {
        return null;
    }
    playable.sort((a, b) => scoreCard(state, b) - scoreCard(state, a));
    return playable[0];
};
exports.default = {
    getMove,
    getChainMove,
};
