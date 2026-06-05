import {
  Turn,
  Room,
  GameState,
  AvailableRooms,
  HandState,
  NotificationInfo,
  CutInfo,
  PlayerPos,
} from "@shared/types";
import {
  AppServer,
  AppSocket,
  SocketCallback,
} from "@/types";
import { ErrorCode } from "@shared/constants/errorCodes";

export const ok = <T>(
  callback: SocketCallback<T>,
  data: T
) => {
  callback({ success: true, data });
};

export const notOk = <T>(
  callback: SocketCallback<T>,
  error: ErrorCode
) => {
  callback({ success: false, error });
};

// ---

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

// ---

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
  newData: HandState
) => {
  io.to(playerId).emit("game:hand", newData);
};

export const emitTurn = (
  io: AppServer,
  roomId: string,
  turn: Turn
) => {
  io.to(roomId).emit("game:newTurn", turn);
};

export const emitUnoCall = (
  socket: AppSocket,
  roomId: string,
  data: NotificationInfo
) => {
  socket.to(roomId).emit("game:unoCalled", data);
};

export const emitCutInfo = (
  socket: AppSocket,
  roomId: string,
  data: CutInfo
) => {
  socket.to(roomId).emit("game:gotCut", data);
};

export const emitWinner = (
  io: AppServer,
  roomId: string,
  winner: NotificationInfo,
  playerThatLeft?: string
) => {
  io.to(roomId).emit("room:gameEnded", {
    winner,
    playerThatLeft,
  });
};

export const emitTimeout = (
  io: AppServer,
  playerId: string,
  hadToDraw: boolean
) => {
  io.to(playerId).emit("game:timeout", { hadToDraw });
};

export const emitEffect = (
  io: AppServer,
  playerId: string,
  playerPos: PlayerPos,
  cardsDrawn?: number
) => {
  const data = cardsDrawn
    ? {
        type: "DRAW" as const,
        pos: playerPos,
        cards: cardsDrawn,
      }
    : {
        type: "SKIP" as const,
        pos: playerPos,
      };

  io.to(playerId).emit("game:effect", data);
};

export const emitPlayerQuit = (
  socket: AppSocket,
  roomId: string,
  name: string,
  gameState: GameState
) => {
  socket.to(roomId).emit("game:playerQuit", {
    name,
    gameState,
  });
};
