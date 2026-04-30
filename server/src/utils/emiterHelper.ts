import {
  AppServer,
  AppSocket,
  PlayerHand,
  Turn,
  Room,
  GameState,
  AvailableRooms,
  SocketCallback,
} from "@/types";

export const ok = <T>(
  callback: SocketCallback<T>,
  data: T
) => {
  callback({ success: true, data });
};

export const notOk = <T>(
  callback: SocketCallback<T>,
  error: string
) => {
  callback({ success: false, error });
};

export const emitRoomData = (
  io: AppServer,
  newData: Room
) => {
  io.to(newData.id).emit("room:currentData", newData);
};

export const broadcastRoomList = (
  io: AppServer,
  newData: AvailableRooms
) => {
  io.emit("room:availableRooms", newData);
};

export const syncRoom = (
  io: AppServer,
  room: Room,
  rooms: AvailableRooms
) => {
  emitRoomData(io, room);
  broadcastRoomList(io, rooms);
};

// game ------------------------------------------------------------

export const emitGameData = (
  io: AppServer,
  roomId: string,
  newData: GameState
) => {
  io.to(roomId).emit("game:currentData", newData);
};

export const emitPlayerHand = (
  io: AppServer,
  playerId: string,
  newData: PlayerHand
) => {
  io.to(playerId).emit("game:hand", newData);
};

export const emitTurn = (
  io: AppServer,
  roomId: string,
  turn: Turn
) => {
  io.to(roomId).emit("game:turn", turn);
};

export const emitTimeout = (
  io: AppServer,
  roomId: string,
  playerId: string
) => {
  io.to(roomId).emit("game:timeout", { playerId });
};

export const emitPlayerQuit = (
  socket: AppSocket,
  roomId: string,
  playerName: string,
  gameState: GameState
) => {
  socket.to(roomId).emit("game:playerQuit", {
    playerName,
    gameState,
  });
};
