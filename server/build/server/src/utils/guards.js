"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTurnData = exports.getGameData = exports.turnGuard = exports.gameGuard = exports.getTurn = exports.getGame = exports.isPlayerAdmin = exports.isInRoom = exports.getRoom = exports.isSeatTakenByHuman = exports.isSeatTaken = exports.checkSeatsCount = exports.checkRoomName = exports.checkUserName = void 0;
const stores_1 = require("../stores");
const constants_1 = require("../../../shared/constants");
const emiterHelper_1 = require("./emiterHelper");
const seatsHelper_1 = require("./seatsHelper");
const BOT_NAMES = ["BOT-1", "BOT-2", "BOT-3", "BOT-4"];
const checkUserName = (newName, callback) => {
    if (newName.length < 1) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NAME_EMPTY);
        return false;
    }
    if (newName.length > 10) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.USER_LENGTH);
        return false;
    }
    const isTaken = [
        ...stores_1.users.values(),
        ...BOT_NAMES,
    ].includes(newName);
    if (isTaken) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NAME_TAKEN);
        return false;
    }
    return true;
};
exports.checkUserName = checkUserName;
const checkRoomName = (name, callback) => {
    const trimmedName = name.trim();
    if (trimmedName.length < 1) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NAME_EMPTY);
        return false;
    }
    if (trimmedName.length > 15) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.ROOM_LENGTH);
        return false;
    }
    return true;
};
exports.checkRoomName = checkRoomName;
const checkSeatsCount = (seats, callback) => {
    const numSeats = seats.filter((s) => s.type).length;
    if (numSeats === 0) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NOT_ENOUGH_SEATS);
        return false;
    }
    return true;
};
exports.checkSeatsCount = checkSeatsCount;
const isSeatTaken = (room, position, callback) => {
    const isOccupied = (0, seatsHelper_1.isSeatOccupied)(room, position);
    if (isOccupied) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.SEAT_TAKEN);
        return true;
    }
    return false;
};
exports.isSeatTaken = isSeatTaken;
const isSeatTakenByHuman = (room, position, callback) => {
    const player = (0, seatsHelper_1.getSeatPlayer)(room, position);
    if ((player === null || player === void 0 ? void 0 : player.type) === "human") {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.SEAT_TAKEN);
        return true;
    }
    return false;
};
exports.isSeatTakenByHuman = isSeatTakenByHuman;
const getRoom = ({ socket, roomId, callback, }) => {
    const id = roomId !== null && roomId !== void 0 ? roomId : socket.data.roomId;
    const room = id ? stores_1.rooms.get(id) : null;
    if (!room) {
        if (callback) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.ROOM_NOT_FOUND);
        }
        else {
            const err = { error: constants_1.ERROR_CODES.ROOM_NOT_FOUND };
            socket.emit("room:error", err);
        }
        return null;
    }
    return room;
};
exports.getRoom = getRoom;
const isInRoom = (playerId, room, callback) => {
    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
        if (callback) {
            (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NOT_IN_ROOM);
        }
        return null;
    }
    return player;
};
exports.isInRoom = isInRoom;
const isPlayerAdmin = (socket, room, callback) => {
    const isAdmin = socket.id === room.adminId;
    if (!isAdmin) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NOT_ADMIN);
        return false;
    }
    return true;
};
exports.isPlayerAdmin = isPlayerAdmin;
const getGame = (roomId, callback) => {
    const game = stores_1.games.get(roomId);
    if (!game) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.GAME_NOT_FOUND);
        return null;
    }
    return game;
};
exports.getGame = getGame;
const getTurn = (roomId, callback) => {
    const turn = stores_1.turns.get(roomId);
    if (!turn) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.TURN_NOT_FOUND);
        return null;
    }
    return turn;
};
exports.getTurn = getTurn;
const gameGuard = (socket, callback) => {
    const room = (0, exports.getRoom)({ socket, callback });
    if (!room)
        return null;
    const player = (0, exports.isInRoom)(socket.id, room, callback);
    if (!player)
        return null;
    const game = (0, exports.getGame)(room.id, callback);
    if (!game)
        return null;
    const find = (p) => p.id === socket.id;
    const state = game.players.find(find);
    if (!state)
        return null;
    return { room, game, player, state };
};
exports.gameGuard = gameGuard;
const turnGuard = (socket, callback) => {
    const data = (0, exports.gameGuard)(socket, callback);
    if (!data)
        return null;
    const turn = (0, exports.getTurn)(data.room.id, callback);
    if (!turn)
        return null;
    if (Date.now() >= turn.expiresAt) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.TURN_EXPIRED);
        return;
    }
    if (turn.currentPlayerId !== socket.id) {
        (0, emiterHelper_1.notOk)(callback, constants_1.ERROR_CODES.NOT_YOUR_TURN);
        return null;
    }
    return Object.assign(Object.assign({}, data), { turn });
};
exports.turnGuard = turnGuard;
const getGameData = (io, roomId) => {
    const room = stores_1.rooms.get(roomId);
    const game = stores_1.games.get(roomId);
    if (!room || !game) {
        const error = !room
            ? constants_1.ERROR_CODES.ROOM_NOT_FOUND
            : constants_1.ERROR_CODES.GAME_NOT_FOUND;
        io.to(roomId).emit("room:error", { error });
        return null;
    }
    return { room, game };
};
exports.getGameData = getGameData;
const getTurnData = (io, roomId) => {
    const gameData = (0, exports.getGameData)(io, roomId);
    if (!gameData)
        return null;
    const turn = stores_1.turns.get(roomId);
    if (!turn) {
        const err = { error: constants_1.ERROR_CODES.TURN_NOT_FOUND };
        io.to(roomId).emit("room:error", err);
        return null;
    }
    const { game } = gameData;
    const state = game.players[game.currPlayerIndex];
    return Object.assign(Object.assign({}, gameData), { turn, state });
};
exports.getTurnData = getTurnData;
