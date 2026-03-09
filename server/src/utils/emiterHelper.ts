import { Server, Socket } from "socket.io";
import { Room, Card, GameState, LeaveRoomRes, Message } from "@/types";
import { users } from "@/stores/users.store";
import logger from "./logger";

export const emit = <T,>(
  socket: Socket,
  to: string,
  data: T, 
) => {
    socket.emit(to, { 
      success: true,
      error: null,
      data,
    });
};

export const emitError = (
  socket: Socket, 
  emitTo: string, 
  error: string,
) => {
  socket.emit(emitTo, {
    success: false,
    error,
    data: null,
  })
};

export const emitRoomInfo = (
  io: Server,
  room: Room,
) => {
  io.to(room.id).emit("room:newInfo", {
    success: true,
    error: null,
    data: room,
  });
};

export const emitMessage = (
  io: Server,
  roomId: string, 
  message: Message,
) => {
  io.to(roomId).emit("chat:newMessage", {
    success: true,
    error: null,
    data: message ,
  });
};

export const broadcastRoomList = (
  io: Server,
  rooms: { availableRooms: Room[] },
) => {
  io.emit("room:list", rooms);
};

export const emitRoomLeft = (
  io: Server,
  socket: Socket,
  availableRooms: { availableRooms: Room[] },
  res: LeaveRoomRes,
) => {
  broadcastRoomList(io, availableRooms);

  switch(res.type) {
    case "ROOM_DELETED":
      logger.roomLog(res.roomId,`${users.get(socket.id)} [${socket.id}] left the room.`);
      logger.roomLog(res.roomId, `room was deleted.`);
      break;
    case "ROOM_LEFT":  
      emitRoomInfo(io, res.room);

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

