"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSocket = void 0;
const stores_1 = require("../stores");
const services_1 = require("../services");
const emiterHelper_1 = require("../utils/emiterHelper");
const gameLoop_1 = require("../loop/gameLoop");
const guards_1 = require("../utils/guards");
const userSocket = (io, socket) => {
    let name = services_1.userService.generateName(socket.id);
    socket.emit("user:connected", { name });
    socket.on("user:updateName", ({ newName }, callback) => {
        const trimmedName = newName.trim();
        const isTaken = (0, guards_1.checkUserName)(trimmedName, callback);
        if (!isTaken)
            return;
        services_1.userService.updateName(socket.id, trimmedName);
        name = newName;
        (0, emiterHelper_1.ok)(callback, { name: trimmedName });
    });
    socket.on("disconnect", () => {
        (0, gameLoop_1.handleExit)(io, socket);
        stores_1.users.delete(socket.id);
    });
};
exports.userSocket = userSocket;
