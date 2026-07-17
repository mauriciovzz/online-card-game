"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExit = exports.endGame = exports.startTurn = void 0;
const stores_1 = require("../stores");
const services_1 = require("../services");
const emiterHelper_1 = require("../utils/emiterHelper");
const guards_1 = require("../utils/guards");
const BotLoop_1 = require("./botLogic/BotLoop");
const gameActions_1 = require("./gameActions");
const seatsHelper_1 = require("../utils/seatsHelper");
const timeout = (io, roomId, playerId) => {
    const turnData = (0, guards_1.getTurnData)(io, roomId);
    if (!turnData)
        return;
    const { room, game, turn, state } = turnData;
    const hasStackEffect = room.rules.stack && game.currEffect;
    if (hasStackEffect) {
        (0, emiterHelper_1.emitEffect)(io, state.id, state.pos, game.currEffect !== "SKIP"
            ? game.currDrawStack
            : undefined);
    }
    else {
        const hadToDraw = turn.actions.draw;
        if (hadToDraw) {
            const updatedHand = services_1.gameService.autoDraw(game);
            (0, emiterHelper_1.emitPlayerHand)(io, playerId, updatedHand);
            const gameState = services_1.gameService.getState(game);
            (0, emiterHelper_1.emitGameData)(io, room.id, gameState);
        }
        (0, emiterHelper_1.emitTimeout)(io, playerId, hadToDraw);
    }
    (0, gameActions_1.endTurn)(io, roomId, game);
};
const applyPendingEffect = (io, room, game) => {
    const { players, currEffect, currPlayerIndex } = game;
    const affectedPlayer = players[currPlayerIndex];
    const updatedHand = services_1.gameService.skipTurn(game);
    if (currEffect !== "SKIP" && updatedHand) {
        (0, emiterHelper_1.emitPlayerHand)(io, affectedPlayer.id, updatedHand);
        (0, emiterHelper_1.emitGameData)(io, room.id, services_1.gameService.getState(game));
    }
    (0, emiterHelper_1.emitEffect)(io, affectedPlayer.id, affectedPlayer.pos, updatedHand === null || updatedHand === void 0 ? void 0 : updatedHand.cards.length);
};
const startTurn = (io, roomId) => {
    const gameData = (0, guards_1.getGameData)(io, roomId);
    if (!gameData)
        return;
    const { room, game } = gameData;
    const existingTimer = stores_1.timers.get(room.id);
    if (existingTimer)
        clearTimeout(existingTimer);
    if (game.currEffect) {
        if (room.rules.stack) {
            const { players, currEffect, currPlayerIndex } = game;
            const affectedPlayer = players[currPlayerIndex];
            const canPlay = affectedPlayer.cards.some((c) => c.type === currEffect);
            const hasOneCard = affectedPlayer.cards.length === 1;
            if (!canPlay || hasOneCard) {
                applyPendingEffect(io, room, game);
            }
        }
        else {
            applyPendingEffect(io, room, game);
        }
    }
    const currPlayerIndex = game.currPlayerIndex;
    const currPlayerId = game.players[currPlayerIndex].id;
    const turn = services_1.gameService.createTurn(room.id, Number(room.turnDuration) * 1000, currPlayerId, game.currEffect);
    (0, emiterHelper_1.emitTurn)(io, room.id, turn);
    const currentPlayer = game.players[currPlayerIndex];
    if (currentPlayer.type === "bot") {
        void (0, BotLoop_1.startBotTurn)(io, room.id);
        return;
    }
    const countDown = Number(room.turnDuration) * 1000;
    const timer = setTimeout(() => {
        timeout(io, roomId, currPlayerId);
    }, countDown);
    stores_1.timers.set(room.id, timer);
};
exports.startTurn = startTurn;
const endGame = (io, room, winner, losers, playerThatLeft) => {
    services_1.gameService.cleanUp(room.id);
    let score = undefined;
    if (winner && losers) {
        score = services_1.roomService.updateScore(room, winner.id, losers);
    }
    room.currWinner = winner ? winner.id : null;
    const winnerInfo = !winner
        ? undefined
        : {
            id: winner.id,
            name: winner.name,
            pos: winner.pos,
            score,
        };
    (0, emiterHelper_1.emitRoomData)(io, room);
    (0, emiterHelper_1.emitGameEnded)(io, room.id, winnerInfo, playerThatLeft);
    if (!(0, seatsHelper_1.isRoomFull)(room)) {
        room.state = "WAITING";
        (0, emiterHelper_1.emitRoomData)(io, room);
        (0, emiterHelper_1.broadcastRoomList)(io, services_1.roomService.getAvailable());
    }
};
exports.endGame = endGame;
const handleExit = (io, socket) => {
    const roomId = socket.data.roomId;
    if (!roomId)
        return;
    const room = stores_1.rooms.get(roomId);
    if (!room)
        return;
    const player = (0, guards_1.isInRoom)(socket.id, room);
    if (!player)
        return;
    void socket.leave(room.id);
    socket.data.roomId = undefined;
    const realPlayers = room.players.filter((p) => p.type === "human").length;
    if (realPlayers === 1) {
        stores_1.rooms.delete(room.id);
        (0, emiterHelper_1.broadcastRoomList)(io, services_1.roomService.getAvailable());
        return;
    }
    services_1.roomService.leave(room, socket.id);
    const game = stores_1.games.get(roomId);
    if (!game) {
        (0, emiterHelper_1.emitRoomData)(io, room);
        (0, emiterHelper_1.broadcastRoomList)(io, services_1.roomService.getAvailable());
        return;
    }
    if (game.players.length === 2) {
        const filter = (p) => p.id !== socket.id;
        const winner = game.players.find(filter);
        if (!winner)
            return;
        endGame(io, room, winner, undefined, player.name);
        return;
    }
    const wasPlaying = services_1.gameService.leave(game, socket.id);
    const gamestate = services_1.gameService.getState(game);
    (0, emiterHelper_1.emitRoomData)(io, room);
    (0, emiterHelper_1.emitPlayerQuit)(socket, room.id, player.name, gamestate);
    if (wasPlaying) {
        startTurn(io, roomId);
    }
};
exports.handleExit = handleExit;
