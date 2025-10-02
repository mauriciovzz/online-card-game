import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const cors = require("cors");

import { GameRoom } from "./types"

import cardDeckHelper from "./utils/cardDeckHelper";

const app = express();
app.use(cors)

const httpServer = createServer(app);

const rooms: Record<string, GameRoom> = {};

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
});

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  socket.on("getRooms", () => {
    const availableRooms = Object.entries(rooms)
      .filter(([_, state]) => state.state !== "playing")
      .map(([roomName, state]) => {
        roomName;
        numPlayers: state.numPlayers;
        players: state.players.length;
      })
    
      socket.emit("roomsList", availableRooms)
  })

    socket.on("createRoom", (RoomName, numPlayers, playerName) => {
    if(rooms[RoomName]){
      socket.emit("erroMsg", "RoomAlreadyExists")
    }

    rooms[RoomName] = {
      state: "waiting",
      cardDeck: cardDeckHelper.createCardDeck(),
      pile: [],
      numPlayers,

      players: [{
        id: socket.id,
        name: playerName,
        cards: []
      }],
      currentTurn: 0,
    }
    
    socket.join(RoomName);
    socket.emit("RoomCreated", RoomName);
  })
});

const PORT = 3003;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});