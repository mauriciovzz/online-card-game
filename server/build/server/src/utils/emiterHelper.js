"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitPlayerQuit = exports.emitEffect = exports.emitTimeout = exports.emitGameEnded = exports.emitCutInfo = exports.emitUnoCall = exports.emitTurn = exports.emitPlayerHand = exports.emitGameData = exports.syncRoom = exports.broadcastRoomList = exports.emitRoomData = exports.notOk = exports.ok = void 0;
const ok = (callback, data) => {
    callback({ success: true, data });
};
exports.ok = ok;
const notOk = (callback, error) => {
    callback({ success: false, error });
};
exports.notOk = notOk;
// ---
const emitRoomData = (io, newData) => {
    io.to(newData.id).emit("room:currentData", newData);
};
exports.emitRoomData = emitRoomData;
const broadcastRoomList = (io, newData) => {
    io.emit("room:availableRooms", newData);
};
exports.broadcastRoomList = broadcastRoomList;
const syncRoom = (io, room, rooms) => {
    (0, exports.emitRoomData)(io, room);
    (0, exports.broadcastRoomList)(io, rooms);
};
exports.syncRoom = syncRoom;
// ---
const emitGameData = (io, roomId, newData) => {
    io.to(roomId).emit("game:currentData", newData);
};
exports.emitGameData = emitGameData;
const emitPlayerHand = (io, playerId, newData) => {
    io.to(playerId).emit("game:hand", newData);
};
exports.emitPlayerHand = emitPlayerHand;
const emitTurn = (io, roomId, turn) => {
    io.to(roomId).emit("game:newTurn", turn);
};
exports.emitTurn = emitTurn;
const emitUnoCall = (s, roomId, data) => {
    s.to(roomId).emit("game:unoCalled", data);
};
exports.emitUnoCall = emitUnoCall;
const emitCutInfo = (s, roomId, data) => {
    s.to(roomId).emit("game:gotCut", data);
};
exports.emitCutInfo = emitCutInfo;
const emitGameEnded = (io, roomId, winner, playerThatLeft) => {
    io.to(roomId).emit("room:gameEnded", {
        winner,
        playerThatLeft,
    });
};
exports.emitGameEnded = emitGameEnded;
const emitTimeout = (io, playerId, hadToDraw) => {
    io.to(playerId).emit("game:timeout", { hadToDraw });
};
exports.emitTimeout = emitTimeout;
const emitEffect = (io, playerId, playerPos, cardsDrawn) => {
    const data = cardsDrawn
        ? {
            type: "DRAW",
            pos: playerPos,
            cards: cardsDrawn,
        }
        : {
            type: "SKIP",
            pos: playerPos,
        };
    io.to(playerId).emit("game:effect", data);
};
exports.emitEffect = emitEffect;
const emitPlayerQuit = (socket, roomId, name, gameState) => {
    socket.to(roomId).emit("game:playerQuit", {
        name,
        gameState,
    });
};
exports.emitPlayerQuit = emitPlayerQuit;
