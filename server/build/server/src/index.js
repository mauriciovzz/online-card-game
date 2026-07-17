"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sockets_1 = require("./sockets");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const allowedOrigins = [
    "http://localhost:5173",
    "http://192.168.100.73/5173",
    "http://localhost:4173",
    "http://192.168.100.73/4173",
];
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: allowedOrigins,
    },
});
io.on("connection", (socket) => {
    (0, sockets_1.registerSocketHandlers)(io, socket);
});
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT.toString()}`);
});
