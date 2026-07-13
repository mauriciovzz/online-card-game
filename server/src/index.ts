import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";

import { registerSocketHandlers } from "./sockets";

import { env } from "./utils/env";
import { AppServer } from "./types";

const app = express();
app.use(cors);

const httpServer = createServer(app);

const io: AppServer = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      `${env.HOST}:${env.CLIENT_PORT}`,
      `${env.HOST}:${env.CLIENT_BUILD_PORT}`,
    ],
  },
});

io.on("connection", (socket) => {
  registerSocketHandlers(io, socket);
});

httpServer.listen(env.SERVER_PORT, () => {
  console.log("Server running on port", env.SERVER_PORT);
});
