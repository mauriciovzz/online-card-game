import { Server, Socket } from "socket.io";
import { Room, Card, GameState, Message, AvailableRooms, SocketCallback } from "@/types";
import { users } from "@/stores/users.store";

export const emit = <T,>(
  socket: Socket,
  event: string,
  data: T, 
) => {
    socket.emit(event, { 
      success: true,
      error: null,
      data,
    });
};

export const ok = <T>(callback: SocketCallback<T>, data: T) =>
  callback({ success: true, data });

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
  io.to(room.id).emit("room:currentInfo", {
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
  rooms: AvailableRooms,
) => {
  io.emit("room:availableRooms", { 
    success: true,
    error: null,
    data: rooms,
  });
};

export const syncRoom = (io: Server, room: Room, rooms: AvailableRooms) => {
  broadcastRoomList(io, rooms);
  emitRoomInfo(io, room);
}

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

