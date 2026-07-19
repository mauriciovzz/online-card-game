import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";

import { registerSocketHandlers } from "./sockets";

import { AppServer } from "./types";

const app = express();
app.use(cors());

const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://192.168.100.73:5173",
  "http://192.168.100.73:4173",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const io: AppServer = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  },
});

io.on("connection", (socket) => {
  registerSocketHandlers(io, socket);
});

const PORT = process.env.PORT ?? 3003;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT.toString()}`);
});
