"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stores_1 = require("../stores");
const deckHelper_1 = __importDefault(require("../utils/deckHelper"));
const getNextPlayerIndex = (game) => {
    const { direction, players, currPlayerIndex } = game;
    const members = players.length;
    return (currPlayerIndex + direction + members) % members;
};
const adjustPlayerIndex = (currentPlayerIndex, removedIndex, playersLeft, direction) => {
    if (removedIndex < currentPlayerIndex) {
        return currentPlayerIndex - 1;
    }
    if (removedIndex === currentPlayerIndex) {
        if (direction === 1) {
            return currentPlayerIndex % playersLeft;
        }
        return ((currentPlayerIndex - 1 + playersLeft) % playersLeft);
    }
    return currentPlayerIndex;
};
// ------------------------------------------------------------
const createGame = (room) => {
    var _a;
    const { deck, pile } = deckHelper_1.default.createDeck();
    const players = [...room.players]
        .sort((a, b) => a.pos - b.pos)
        .map((p) => (Object.assign(Object.assign({}, p), { cards: deck.splice(0, 7), calledUno: false })));
    const firstPlayer = (_a = room.currWinner) !== null && _a !== void 0 ? _a : room.adminId;
    const currPlayerIndex = room.players.findIndex((p) => p.id === firstPlayer);
    const game = {
        players,
        currPlayerIndex,
        deck,
        pile,
        direction: 1,
        topCard: pile[0],
        currEffect: null,
        nextEffect: null,
        currDrawStack: 0,
    };
    stores_1.games.set(room.id, game);
};
const createTurn = (roomId, turnDuration, currentPlayerId, effect) => {
    const now = new Date().getTime();
    const turn = {
        startTime: now,
        expiresAt: now + turnDuration,
        effect,
        currentPlayerId,
        actions: {
            draw: true,
            play: true,
            end: false,
        },
    };
    stores_1.turns.set(roomId, turn);
    return turn;
};
const afterDraw = (turn) => {
    turn.actions.draw = false;
    turn.actions.play = true;
    turn.actions.end = true;
};
const afterPlay = (turn) => {
    turn.actions.draw = false;
    turn.actions.play = false;
    turn.actions.end = true;
};
const getState = (game) => ({
    players: game.players.map((p) => {
        const { cards } = p, rest = __rest(p, ["cards"]);
        return Object.assign(Object.assign({}, rest), { numCards: cards.length });
    }),
    direction: game.direction,
    topCard: game.topCard,
    currDrawStack: game.currDrawStack,
});
const getHand = (game, id) => {
    const state = game.players.find((p) => p.id === id);
    if (!state)
        return { cards: [], calledUno: false };
    return {
        cards: state.cards.map((card) => (Object.assign({}, card))),
        calledUno: state.calledUno,
    };
};
const autoDraw = (game) => {
    const cardsToDraw = 1;
    const updatedHand = deckHelper_1.default.draw(game.players[game.currPlayerIndex], cardsToDraw, game);
    return updatedHand;
};
const advanceTurn = (game) => {
    game.currEffect = game.nextEffect;
    game.nextEffect = null;
    game.currPlayerIndex = getNextPlayerIndex(game);
};
const skipTurn = (game) => {
    let updatedHand = undefined;
    if (game.currEffect !== "SKIP") {
        updatedHand = deckHelper_1.default.draw(game.players[game.currPlayerIndex], game.currDrawStack, game);
        game.currDrawStack = 0;
    }
    game.currPlayerIndex = getNextPlayerIndex(game);
    game.currEffect = null;
    game.nextEffect = null;
    return updatedHand;
};
const applyEffect = (game, type) => {
    switch (type) {
        case "SKIP":
            game.nextEffect = type;
            break;
        case "REVERSE":
            game.direction = game.direction === 1 ? -1 : 1;
            break;
        case "DRAW_TWO":
            game.nextEffect = type;
            game.currDrawStack += 2;
            break;
        case "DRAW_FOUR":
            game.nextEffect = type;
            game.currDrawStack += 4;
            break;
    }
};
const cleanUp = (roomId) => {
    const timer = stores_1.timers.get(roomId);
    if (timer)
        clearTimeout(timer);
    stores_1.timers.delete(roomId);
    stores_1.turns.delete(roomId);
    stores_1.games.delete(roomId);
};
const leave = (game, playerId) => {
    const find = (p) => p.id === playerId;
    const playerIndex = game.players.findIndex(find);
    const newIndex = adjustPlayerIndex(game.currPlayerIndex, playerIndex, game.players.length - 1, game.direction);
    game.currEffect = null;
    game.nextEffect = null;
    game.currDrawStack = 0;
    game.deck.push(...game.players[playerIndex].cards);
    game.players.splice(playerIndex, 1);
    game.currPlayerIndex = newIndex;
    return playerIndex === game.currPlayerIndex;
};
exports.default = {
    createGame,
    createTurn,
    afterDraw,
    afterPlay,
    getHand,
    getState,
    autoDraw,
    applyEffect,
    skipTurn,
    advanceTurn,
    leave,
    cleanUp,
};
