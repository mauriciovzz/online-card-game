"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = void 0;
const guards_1 = require("../utils/guards");
const services_1 = require("../services");
const chatSocket = (io, socket) => {
    socket.on("chat:sendMessage", ({ content }) => {
        const room = (0, guards_1.getRoom)({ socket });
        if (!room)
            return;
        const player = (0, guards_1.isInRoom)(socket.id, room);
        if (!player)
            return;
        const newMessage = services_1.chatService.createMessage(socket, player.name, content);
        io.to(room.id).emit("chat:newMessage", newMessage);
    });
    socket.on("chat:typing:start", () => {
        const room = (0, guards_1.getRoom)({ socket });
        if (!room)
            return;
        const player = (0, guards_1.isInRoom)(socket.id, room);
        if (!player)
            return;
        socket.to(room.id).emit("chat:typing:start", {
            playerId: socket.id,
        });
    });
    socket.on("chat:typing:stop", () => {
        const room = (0, guards_1.getRoom)({ socket });
        if (!room)
            return;
        const player = (0, guards_1.isInRoom)(socket.id, room);
        if (!player)
            return;
        socket.to(room.id).emit("chat:typing:stop", {
            playerId: socket.id,
        });
    });
    socket.on("chat:read", ({ lastReadCreatedAt }) => {
        const room = (0, guards_1.getRoom)({ socket });
        if (!room)
            return;
        socket.to(room.id).emit("chat:readUpdate", {
            playerId: socket.id,
            lastReadCreatedAt,
        });
    });
};
exports.chatSocket = chatSocket;
