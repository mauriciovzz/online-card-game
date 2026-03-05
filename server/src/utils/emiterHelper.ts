import { Server, Socket } from "socket.io";
import { Room, Card, GameState, LeaveRoomRes, } from "@/types";
import { users } from "@/stores/users.store";
import logger from "./logger";

// room ---

export const emitRoomError = (
  socket: Socket, 
  emitTo: string, 
  errorName: string,
) => {
  socket.emit(emitTo, {
    success: false,
    error: errorName,
    data: null,
  })
};

export const emitRoomLeft = (
  io: Server,
  socket: Socket,
  availableRooms: { availableRooms: Room[] },
  res: LeaveRoomRes,
) => {
  switch(res.type) {
    case "ROOM_DELETED":
      io.emit("room:list", availableRooms);

      logger.roomLog(res.roomId,`${users.get(socket.id)} [${socket.id}] left the room.`);
      logger.roomLog(res.roomId, `room was deleted.`);
      break;
    case "ROOM_LEFT":  
      io.emit("room:list", availableRooms);
      io.to(res.room.id).emit("room:updatedInfo", res.room);

      logger.roomLog(res.room.id, `${users.get(socket.id)} [${socket.id}] left the room.`);
      break;
  };
};

// game ---

export const emitGameError = (
  socket: Socket, 
  roomId: string, 
  emitTo: string, 
  errorName: string,
) => {
  socket.to(roomId).emit(emitTo, {
    success: false,
    error: errorName,
    data: null,
  })
};

export const emitGameLeft = (
  io: Server,
  socket: Socket,
  room: Room,
  gameState: GameState,
) => {
  io.to(room.id).emit("game:playerLeft", {
    playerWhoLeft: users.get(socket.id),
    gameState,
  });
};

export const emitGameState = (
  io: Server, 
  roomId: string, 
  gameState: GameState
) => {
  io.to(roomId).emit(
    "game:state",
    { gameState },
  );
};

export const emitSocketHand = (
  socket: Socket,
  hand: Card[],
) => {
  socket.emit(
    "game:hand", 
    { hand },
  );
};

