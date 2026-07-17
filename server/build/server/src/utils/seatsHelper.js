"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomState = exports.isRoomFull = exports.isSeatOccupied = exports.getSeatPlayer = void 0;
const getSeatPlayer = (room, pos) => room.players.find((p) => p.pos === pos);
exports.getSeatPlayer = getSeatPlayer;
const isSeatOccupied = (room, pos) => !!(0, exports.getSeatPlayer)(room, pos);
exports.isSeatOccupied = isSeatOccupied;
const isRoomFull = (room) => room.seats
    .filter((seat) => seat.type)
    .every((seat) => room.players.some((player) => player.pos === seat.pos));
exports.isRoomFull = isRoomFull;
const updateRoomState = (room) => {
    room.state = (0, exports.isRoomFull)(room) ? "FULL" : "WAITING";
};
exports.updateRoomState = updateRoomState;
