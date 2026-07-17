"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBotTurn = void 0;
const bot_service_1 = __importDefault(require("./bot.service"));
const gameActions_1 = require("../gameActions");
const guards_1 = require("../../utils/guards");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// ---------
const botUnoCall = (io, state, turnData) => {
    if (state.cards.length === 1 && Math.random() <= 0.7) {
        (0, gameActions_1.callUno)(io, turnData);
    }
};
const startBotTurn = (io, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const turnData = (0, guards_1.getTurnData)(io, roomId);
    if (!turnData)
        return;
    const { room, game, state } = turnData;
    yield sleep(1200);
    // STACK RESPONSE
    if (game.currEffect) {
        const stackMove = bot_service_1.default.getMove(game, state);
        yield sleep(1200);
        if (!stackMove) {
            (0, gameActions_1.endStack)(io, turnData);
            yield sleep(1200);
            return;
        }
        (0, gameActions_1.playCard)(io, turnData, {
            cardId: stackMove.card.id,
            chosenColor: stackMove.chosenColor,
        });
        botUnoCall(io, state, turnData);
        yield sleep(1200);
        return;
    }
    // NORMAL PLAY
    let move = bot_service_1.default.getMove(game, state);
    // DRAW
    if (!move) {
        yield sleep(1200);
        (0, gameActions_1.drawCard)(io, turnData);
        yield sleep(1200);
        move = bot_service_1.default.getMove(game, state);
        // Still can't play
        if (!move) {
            (0, gameActions_1.endTurn)(io, room.id, game);
            yield sleep(1200);
            return;
        }
    }
    // PLAY
    (0, gameActions_1.playCard)(io, turnData, {
        cardId: move.card.id,
        chosenColor: move.chosenColor,
    });
    botUnoCall(io, state, turnData);
    yield sleep(1200);
    // CONTINUE WITH MIRROR / STAIR
    const { mirror, stair } = room.rules;
    const hasChainRule = mirror || stair;
    const playedNumberCard = move.card.type === "NUMBER";
    const canContinueTurn = hasChainRule && playedNumberCard;
    if (canContinueTurn) {
        let canPlay = true;
        while (canPlay) {
            const currTurnData = (0, guards_1.getTurnData)(io, roomId);
            if (!currTurnData)
                return;
            if (currTurnData.turn.currentPlayerId !== state.id) {
                return;
            }
            const nextMove = bot_service_1.default.getChainMove(currTurnData);
            if (!nextMove) {
                (0, gameActions_1.endTurn)(io, room.id, currTurnData.game);
                canPlay = false;
            }
            else {
                yield sleep(1200);
                (0, gameActions_1.playCard)(io, currTurnData, {
                    cardId: nextMove.id,
                });
                botUnoCall(io, state, turnData);
            }
        }
    }
    yield sleep(1200);
});
exports.startBotTurn = startBotTurn;
