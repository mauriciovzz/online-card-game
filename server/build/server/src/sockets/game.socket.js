"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSocket = void 0;
const services_1 = require("../services");
const guards_1 = require("../utils/guards");
const emiterHelper_1 = require("../utils/emiterHelper");
const gameActions_1 = require("../loop/gameActions");
const cardVariables_1 = require("../../../shared/constants/cardVariables");
const moveHelper_1 = __importDefault(require("../../../shared/utils/moveHelper"));
const constants_1 = require("../../../shared/constants");
const gameSocket = (io, socket) => {
    socket.on("game:getData", (callback) => {
        const gameData = (0, guards_1.gameGuard)(socket, callback);
        if (!gameData)
            return;
        const initialData = {
            gameState: services_1.gameService.getState(gameData.game),
            cards: gameData.state.cards,
        };
        (0, emiterHelper_1.ok)(callback, initialData);
    });
    socket.on("game:playCard", (playedCard, callback) => {
        const { cardId, chosenColor } = playedCard;
        const turnData = (0, guards_1.turnGuard)(socket, callback);
        if (!turnData)
            return;
        const { room, game, turn, state } = turnData;
        const { cards } = state;
        const getCard = (c) => c.id === cardId;
        const card = cards.find(getCard);
        if (!card) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.CARD_NOT_FOUND);
            return;
        }
        const { type } = card;
        if (type === "WILD_CARD" || type === "DRAW_FOUR") {
            if (!chosenColor) {
                (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.COLOR_MISSING);
                return;
            }
            if (!cardVariables_1.CARD_COLORS.includes(chosenColor)) {
                (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.INVALID_COLOR);
                return;
            }
        }
        if (cards.length === 1 && type !== "NUMBER") {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.HAS_TO_BE_NUMBER);
            return;
        }
        const { rules } = room;
        const canChain = rules.stair || rules.mirror;
        // stack response
        if (game.currEffect) {
            const isValid = game.currEffect === type;
            if (!isValid) {
                (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.INVALID_MOVE);
                return;
            }
        }
        // stair on / mirror on
        else if (canChain && !turn.actions.play) {
            const isValid = moveHelper_1.default.checkChainMove(game.topCard, card, rules);
            if (!isValid) {
                (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.INVALID_MOVE);
                return;
            }
        }
        // normal first play
        else {
            if (!turn.actions.play) {
                (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.ALREADY_PLAYED);
                return;
            }
            const isValid = moveHelper_1.default.checkMove(game.topCard, card);
            if (!isValid) {
                (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.INVALID_MOVE);
                return;
            }
        }
        (0, emiterHelper_1.ok)(callback, null);
        (0, gameActions_1.playCard)(io, turnData, playedCard);
    });
    socket.on("game:drawCard", (callback) => {
        const turnData = (0, guards_1.turnGuard)(socket, callback);
        if (!turnData)
            return;
        const { game, turn } = turnData;
        const { draw } = turn.actions;
        if (game.currEffect) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.EFFECT_ON);
            return;
        }
        if (!draw) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.ALREADY_DRAW);
            return;
        }
        (0, emiterHelper_1.ok)(callback, null);
        (0, gameActions_1.drawCard)(io, turnData);
    });
    socket.on("game:endTurn", (callback) => {
        const turnData = (0, guards_1.turnGuard)(socket, callback);
        if (!turnData)
            return;
        const { room, game, turn } = turnData;
        if (!turn.actions.end) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.TURN_INCOMPLETE);
            return;
        }
        (0, emiterHelper_1.ok)(callback, null);
        (0, gameActions_1.endTurn)(io, room.id, game);
    });
    socket.on("game:endStack", (callback) => {
        const turnData = (0, guards_1.turnGuard)(socket, callback);
        if (!turnData)
            return;
        (0, emiterHelper_1.ok)(callback, null);
        (0, gameActions_1.endStack)(io, turnData);
    });
    socket.on("game:unoCall", (callback) => {
        const gameData = (0, guards_1.gameGuard)(socket, callback);
        if (!gameData)
            return;
        if (gameData.state.cards.length !== 1) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.INVALID_UNO_CALL);
            return;
        }
        if (gameData.state.calledUno) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.UNO_ALREADY_CALLED);
            return;
        }
        const notificationData = {
            name: gameData.state.name,
            pos: gameData.state.pos,
        };
        (0, emiterHelper_1.ok)(callback, notificationData);
        (0, gameActions_1.callUno)(io, gameData, socket);
    });
    socket.on("game:cutCall", ({ playerId }, callback) => {
        const gameData = (0, guards_1.gameGuard)(socket, callback);
        if (!gameData)
            return;
        const { room, game, state } = gameData;
        const find = (p) => p.id === playerId;
        const cutted = game.players.find(find);
        if (!cutted)
            return;
        if (cutted.cards.length !== 1 || cutted.calledUno) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.INVALID_CUT_CALL);
            return;
        }
        if (playerId === socket.id) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.CAN_NOT_SELF_CUT);
            return;
        }
        (0, emiterHelper_1.ok)(callback, { name: cutted.name, pos: cutted.pos });
        const data = { room, game, cutted, cutter: state };
        (0, gameActions_1.callCut)(io, data, socket);
    });
};
exports.gameSocket = gameSocket;
