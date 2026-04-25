import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { registerSocketHandlers } from "./sockets";

const app = express();
app.use(cors)

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.100.178:5173"]
  }
});

io.on("connection", (socket) => {
  registerSocketHandlers(io, socket);
});

const PORT = 3003;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});