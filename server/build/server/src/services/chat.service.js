"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createMessage = (socket, playerName, content) => {
    const newMessage = {
        id: crypto.randomUUID(),
        senderId: socket.id,
        senderName: playerName,
        content,
        createdAt: new Date().getTime(),
    };
    return newMessage;
};
exports.default = { createMessage };
