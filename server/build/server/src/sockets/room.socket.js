"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomSocket = void 0;
const services_1 = require("../services");
const gameLoop_1 = require("../loop/gameLoop");
const guards_1 = require("../utils/guards");
const emiterHelper_1 = require("../utils/emiterHelper");
const constants_1 = require("../../../shared/constants");
const roomSocket = (io, socket) => {
    socket.on("room:getAvailable", (callback) => {
        (0, emiterHelper_1.ok)(callback, services_1.roomService.getAvailable());
    });
    socket.on("room:create", (payload, callback) => {
        const isFree = (0, guards_1.checkRoomName)(payload.name, callback);
        if (!isFree)
            return;
        const isOk = (0, guards_1.checkSeatsCount)(payload.seats, callback);
        if (!isOk)
            return;
        const roomId = services_1.roomService.create(payload, socket.id);
        void socket.join(roomId);
        socket.data.roomId = roomId;
        (0, emiterHelper_1.ok)(callback, { roomId });
        (0, emiterHelper_1.broadcastRoomList)(io, services_1.roomService.getAvailable());
    });
    socket.on("room:join", ({ roomId }, callback) => {
        const room = (0, guards_1.getRoom)({ socket, roomId, callback });
        if (!room)
            return;
        if (room.state !== "WAITING") {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.GAME_STARTED);
        }
        const success = services_1.roomService.join(room, socket.id);
        if (success) {
            void socket.join(room.id);
            socket.data.roomId = room.id;
            (0, emiterHelper_1.ok)(callback, { roomId });
        }
        else {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.ROOM_FULL);
        }
        (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
    });
    socket.on("room:getData", ({ roomId }, callback) => {
        const room = (0, guards_1.getRoom)({ socket, roomId, callback });
        if (!room)
            return;
        const inRoom = (0, guards_1.isInRoom)(socket.id, room, callback);
        if (!inRoom)
            return;
        (0, emiterHelper_1.ok)(callback, room);
    });
    socket.on("room:update", (newData, callback) => {
        const room = (0, guards_1.getRoom)({ socket, callback });
        if (!room)
            return;
        const isAdmin = (0, guards_1.isPlayerAdmin)(socket, room, callback);
        if (!isAdmin)
            return;
        const nameOk = (0, guards_1.checkRoomName)(newData.name, callback);
        if (!nameOk)
            return;
        services_1.roomService.update(room, newData);
        (0, emiterHelper_1.ok)(callback, null);
        (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
    });
    socket.on("room:openSeat", ({ pos, type }, callback) => {
        const room = (0, guards_1.getRoom)({ socket });
        if (!room)
            return;
        const isAdmin = (0, guards_1.isPlayerAdmin)(socket, room, callback);
        if (!isAdmin)
            return;
        const isTaken = (0, guards_1.isSeatTaken)(room, pos, callback);
        if (isTaken)
            return;
        services_1.roomService.updateSeat(room, { pos, type });
        (0, emiterHelper_1.ok)(callback, null);
        (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
    });
    socket.on("room:closeSeat", ({ pos }, callback) => {
        const room = (0, guards_1.getRoom)({ socket });
        if (!room)
            return;
        const isAdmin = (0, guards_1.isPlayerAdmin)(socket, room, callback);
        if (!isAdmin)
            return;
        const isTaken = (0, guards_1.isSeatTakenByHuman)(room, pos, callback);
        if (isTaken)
            return;
        services_1.roomService.updateSeat(room, { pos, type: undefined });
        (0, emiterHelper_1.ok)(callback, null);
        (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
    });
    socket.on("room:kickPlayer", ({ pos }, callback) => {
        var _a;
        const room = (0, guards_1.getRoom)({ socket, callback });
        if (!room)
            return;
        const isAdmin = (0, guards_1.isPlayerAdmin)(socket, room, callback);
        if (!isAdmin)
            return;
        const playerId = (_a = room.players.find((p) => p.pos === pos)) === null || _a === void 0 ? void 0 : _a.id;
        const memberSocket = io.sockets.sockets.get(playerId !== null && playerId !== void 0 ? playerId : "");
        if (!playerId || !memberSocket) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.PLAYER_NOT_FOUND);
            (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
            return;
        }
        const inRoom = (0, guards_1.isInRoom)(memberSocket.id, room);
        if (!inRoom) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.PLAYER_NOT_FOUND);
            (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
            return;
        }
        memberSocket.emit("room:kickedOut", null);
        (0, gameLoop_1.handleExit)(io, memberSocket);
        (0, emiterHelper_1.ok)(callback, null);
    });
    socket.on("room:resetScores", (callback) => {
        const room = (0, guards_1.getRoom)({ socket, callback });
        if (!room)
            return;
        const isAdmin = (0, guards_1.isPlayerAdmin)(socket, room, callback);
        if (!isAdmin)
            return;
        services_1.roomService.resetScores(room);
        (0, emiterHelper_1.ok)(callback, null);
        (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
    });
    socket.on("room:startGame", (callback) => {
        const room = (0, guards_1.getRoom)({ socket, callback });
        if (!room)
            return;
        const isAdmin = (0, guards_1.isPlayerAdmin)(socket, room, callback);
        if (!isAdmin)
            return;
        if (room.players.length === 1) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NOT_ENOUGH_PLAYERS);
            return;
        }
        room.state = "PLAYING";
        (0, emiterHelper_1.syncRoom)(io, room, services_1.roomService.getAvailable());
        services_1.gameService.createGame(room);
        (0, emiterHelper_1.ok)(callback, null);
        socket.to(room.id).emit("room:gameStarted", null);
        setTimeout(() => {
            (0, gameLoop_1.startTurn)(io, room.id);
        }, 1000);
    });
    socket.on("room:stopGame", (callback) => {
        const room = (0, guards_1.getRoom)({ socket, callback });
        if (!room)
            return;
        const isAdmin = (0, guards_1.isPlayerAdmin)(socket, room, callback);
        if (!isAdmin)
            return;
        (0, gameLoop_1.endGame)(io, room);
    });
    socket.on("room:leave", () => {
        (0, gameLoop_1.handleExit)(io, socket);
    });
};
exports.roomSocket = roomSocket;
