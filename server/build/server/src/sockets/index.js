"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = void 0;
const user_socket_1 = require("./user.socket");
const room_socket_1 = require("./room.socket");
const game_socket_1 = require("./game.socket");
const chat_socket_1 = require("./chat.socket");
const registerSocketHandlers = (io, socket) => {
    (0, user_socket_1.userSocket)(io, socket);
    (0, room_socket_1.roomSocket)(io, socket);
    (0, chat_socket_1.chatSocket)(io, socket);
    (0, game_socket_1.gameSocket)(io, socket);
};
exports.registerSocketHandlers = registerSocketHandlers;
