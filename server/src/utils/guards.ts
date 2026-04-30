import { games, rooms, turns } from "@/stores";

import {
  ErrorResponse,
  PlayerSlot,
  Room,
  AppSocket,
  Game,
  Turn,
  SocketCallback,
} from "@/types";
import { notOk } from "./emiterHelper";

const ERROR_MAP: Record<number, string> = {
  1: "ROOM_NOT_FOUND",
  2: "PLAYER_NOT_FOUND",
  3: "NOT_ADMIN",
  4: "SERVER_ERROR",
};

const roomNotFound = (
  socket: AppSocket,
  callback?: (res: ErrorResponse) => void
) => {
  if (callback) {
    callback({ success: false, error: ERROR_MAP[1] });
  } else {
    socket.emit("room:error", { error: ERROR_MAP[1] });
  }
};

export const getRoom = (
  socket: AppSocket,
  roomId?: string,
  callback?: (res: ErrorResponse) => void
): Room | null => {
  const id = roomId ?? socket.data.roomId;
  if (!id) {
    roomNotFound(socket, callback);
    return null;
  }

  const room = rooms.get(id);
  if (!room) {
    roomNotFound(socket, callback);
    return null;
  }

  return room;
};

export const isPlayerInRoom = (
  room: Room,
  playerId: string
): PlayerSlot | null => {
  const player = room.players.find(
    (p) => p.id === playerId
  );

  if (!player) {
    return null;
  }

  return player;
};

export const isPlayerAdmin = (
  socket: AppSocket,
  room: Room,
  callback: (res: ErrorResponse) => void
) => {
  const isAdmin = socket.id === room.adminId;

  if (!isAdmin) {
    callback({ success: false, error: ERROR_MAP[3] });
    return false;
  }

  return true;
};

export const getGame = (
  roomId: string,
  callback: (res: ErrorResponse) => void
): Game | null => {
  const game = games.get(roomId);

  if (!game) {
    callback({ success: false, error: ERROR_MAP[4] });
    return null;
  }

  return game;
};

export const getTurn = (
  roomId: string,
  callback: (res: ErrorResponse) => void
): Turn | null => {
  const turn = turns.get(roomId);

  if (!turn) {
    callback({ success: false, error: ERROR_MAP[4] });
    return null;
  }

  return turn;
};

export const getTurnData = (roomId: string) => {
  const room = rooms.get(roomId);
  const game = games.get(roomId);

  if (!room || !game) {
    console.log("room:error", { error: "DATA_MISSING" });
    return null;
  }

  return { room, game };
};

export const getGameData = (roomId: string) => {
  const room = rooms.get(roomId);
  const game = games.get(roomId);
  const turn = turns.get(roomId);

  if (!room || !game || !turn) {
    console.log("room:error", { error: "DATA_MISSING" });
    return null;
  }

  return { room, game, turn };
};

export const gameGuard = <T>(
  socket: AppSocket,
  callback: SocketCallback<T>,
  playerId?: string
) => {
  const room = getRoom(socket, undefined, callback);
  if (!room) return null;

  const id = playerId ?? socket.id;
  const isInRoom = isPlayerInRoom(room, id);
  if (!isInRoom) {
    notOk(callback, "NOT_IN_ROOM");
    return null;
  }

  const game = getGame(room.id, callback);
  if (!game) return null;

  return { room, game };
};

export const turnGuard = <T>(
  socket: AppSocket,
  callback: SocketCallback<T>
) => {
  const room = getRoom(socket, undefined, callback);
  if (!room) return null;

  const isInRoom = isPlayerInRoom(room, socket.id);
  if (!isInRoom) notOk(callback, "NOT_IN_ROOM");

  const game = getGame(room.id, callback);
  if (!game) return null;

  const turn = getTurn(room.id, callback);
  if (!turn) return null;

  if (turn.currentPlayerId !== socket.id) {
    notOk(callback, "NOT_YOUR_TURN");
    return null;
  }

  return { room, game, turn };
};
