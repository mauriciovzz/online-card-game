"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callCut = exports.callUno = exports.playCard = exports.endStack = exports.endTurn = exports.drawCard = void 0;
const services_1 = require("../services");
const deckHelper_1 = __importDefault(require("../utils/deckHelper"));
const emiterHelper_1 = require("../utils/emiterHelper");
const gameLoop_1 = require("./gameLoop");
const drawCard = (io, turnData) => {
    const { room, game, turn, state } = turnData;
    services_1.gameService.afterDraw(turn);
    (0, emiterHelper_1.emitTurn)(io, room.id, turn);
    const updatedHand = deckHelper_1.default.draw(state, 1, game);
    (0, emiterHelper_1.emitPlayerHand)(io, state.id, updatedHand);
    (0, emiterHelper_1.emitGameData)(io, room.id, services_1.gameService.getState(game));
    return updatedHand;
};
exports.drawCard = drawCard;
const endTurn = (io, roomId, game) => {
    services_1.gameService.advanceTurn(game);
    (0, gameLoop_1.startTurn)(io, roomId);
};
exports.endTurn = endTurn;
const endStack = (io, turnData) => {
    const { room, game, turn, state } = turnData;
    if (turn.effect !== "SKIP") {
        const nc = game.currDrawStack;
        game.currDrawStack = 0;
        const updatedHand = deckHelper_1.default.draw(state, nc, game);
        (0, emiterHelper_1.emitPlayerHand)(io, state.id, updatedHand);
        const numCards = updatedHand.cards.length;
        (0, emiterHelper_1.emitEffect)(io, state.id, state.pos, numCards);
        (0, emiterHelper_1.emitGameData)(io, room.id, services_1.gameService.getState(game));
    }
    else {
        (0, emiterHelper_1.emitEffect)(io, state.id, state.pos);
    }
    (0, exports.endTurn)(io, room.id, game);
};
exports.endStack = endStack;
const botCut = (io, room, game, targetId, cutter) => {
    const target = game.players.find((p) => p.id === targetId);
    if (!target)
        return;
    if (target.calledUno)
        return;
    if (target.cards.length !== 1)
        return;
    if (Math.random() > 0.7)
        return;
    const data = {
        room,
        game,
        cutted: target,
        cutter,
    };
    (0, exports.callCut)(io, data);
};
const scheduleBotCuts = (io, room, game, targetId) => {
    const bots = game.players.filter((p) => p.type === "bot" && p.id !== targetId);
    for (const bot of bots) {
        const random = Math.floor(Math.random() * 10) + 1;
        const delay = 5000 + random * 1000;
        setTimeout(() => {
            botCut(io, room, game, targetId, bot);
        }, delay);
    }
};
const playCard = (io, turnData, playedCard) => {
    const { room, game, turn, state } = turnData;
    const { cardId, chosenColor } = playedCard;
    const findCard = (c) => c.id === cardId;
    const playedCardIndex = state.cards.findIndex(findCard);
    if (playedCardIndex === -1)
        return;
    const card = state.cards.splice(playedCardIndex, 1)[0];
    const isWildcard = card.type === "WILD_CARD";
    const isDrawFour = card.type === "DRAW_FOUR";
    if ((isWildcard || isDrawFour) && chosenColor) {
        card.color = chosenColor;
    }
    game.pile.push(card);
    game.topCard = card;
    services_1.gameService.applyEffect(game, card.type);
    (0, emiterHelper_1.emitGameData)(io, room.id, services_1.gameService.getState(game));
    // win
    if (state.cards.length === 0) {
        const losers = [...game.players];
        (0, gameLoop_1.endGame)(io, room, state, losers);
        return;
    }
    // schedule cut calls
    if (state.cards.length === 1 && !state.calledUno) {
        scheduleBotCuts(io, room, game, state.id);
    }
    // handle reverse card with 2 players
    if (room.players.length === 2 &&
        card.type === "REVERSE") {
        services_1.gameService.advanceTurn(game);
        const player = game.players[game.currPlayerIndex];
        (0, emiterHelper_1.emitEffect)(io, player.id, player.pos);
        (0, exports.endTurn)(io, room.id, game);
        return;
    }
    // handle chain rules
    const { mirror, stair } = room.rules;
    const canChain = mirror || stair;
    const playedNumberCard = card.type === "NUMBER";
    if (canChain && playedNumberCard) {
        services_1.gameService.afterPlay(turn);
        (0, emiterHelper_1.emitTurn)(io, room.id, turn);
        return;
    }
    (0, exports.endTurn)(io, room.id, game);
};
exports.playCard = playCard;
const callUno = (io, turnData, socket) => {
    const { room, game, state } = turnData;
    state.calledUno = true;
    const gameState = services_1.gameService.getState(game);
    (0, emiterHelper_1.emitGameData)(io, room.id, gameState);
    const notificationData = {
        name: state.name,
        pos: state.pos,
    };
    (0, emiterHelper_1.emitUnoCall)(socket !== null && socket !== void 0 ? socket : io, room.id, notificationData);
};
exports.callUno = callUno;
const callCut = (io, turnData, socket) => {
    const { room, game, cutter, cutted } = turnData;
    const updatedHand = deckHelper_1.default.draw(cutted, 2, game);
    (0, emiterHelper_1.emitPlayerHand)(io, cutted.id, updatedHand);
    const gameState = services_1.gameService.getState(game);
    (0, emiterHelper_1.emitGameData)(io, room.id, gameState);
    const cutInfo = {
        cuttedId: cutted.id,
        cuttedName: cutted.name,
        cuttedPos: cutted.pos,
        cutterName: cutter.name,
        cutterPos: cutter.pos,
    };
    (0, emiterHelper_1.emitCutInfo)(socket !== null && socket !== void 0 ? socket : io, room.id, cutInfo);
};
exports.callCut = callCut;
