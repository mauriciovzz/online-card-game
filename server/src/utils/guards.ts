import { games, rooms, turns, users } from "@/stores";
import { ERROR_CODES } from "@shared/constants";
import { notOk } from "./emiterHelper";

import {
  Room,
  Game,
  Turn,
  Player,
  PlayerState,
  PlayerPos,
  RoomSeat,
} from "@shared/types";
import {
  AppServer,
  AppSocket,
  SocketCallback,
} from "@/types";
import {
  getSeatPlayer,
  isSeatOccupied,
} from "./seatsHelper";

export const checkUserName = <T>(
  newName: string,
  callback: SocketCallback<T>
) => {
  if (newName.length < 1) {
    notOk(callback, ERROR_CODES.NAME_EMPTY);
    return false;
  }

  if (newName.length > 10) {
    notOk(callback, ERROR_CODES.USER_LENGTH);
    return false;
  }

  const isTaken = [...users.values()].includes(newName);

  if (isTaken) {
    notOk(callback, ERROR_CODES.NAME_TAKEN);
    return false;
  }

  return true;
};

export const checkRoomName = <T>(
  name: string,
  callback: SocketCallback<T>
) => {
  const trimmedName = name.trim();

  if (trimmedName.length < 1) {
    notOk(callback, ERROR_CODES.NAME_EMPTY);
    return false;
  }

  if (trimmedName.length > 15) {
    notOk(callback, ERROR_CODES.ROOM_LENGTH);
    return false;
  }

  return true;
};

export const checkSeatsCount = <T>(
  seats: RoomSeat[],
  callback: SocketCallback<T>
) => {
  const numSeats = seats.filter((s) => s.type).length;

  if (numSeats === 0) {
    notOk(callback, ERROR_CODES.NOT_ENOUGH_SEATS);
    return false;
  }

  return true;
};

export const isSeatTaken = <T>(
  room: Room,
  position: PlayerPos,
  callback: SocketCallback<T>
) => {
  const isOccupied = isSeatOccupied(room, position);

  if (isOccupied) {
    notOk(callback, ERROR_CODES.SEAT_TAKEN);
    return true;
  }

  return false;
};

export const isSeatTakenByHuman = <T>(
  room: Room,
  position: PlayerPos,
  callback: SocketCallback<T>
) => {
  const player = getSeatPlayer(room, position);

  if (player?.type === "human") {
    notOk(callback, ERROR_CODES.SEAT_TAKEN);
    return true;
  }

  return false;
};

export const getRoom = <T>({
  socket,
  roomId,
  callback,
}: {
  socket: AppSocket;
  roomId?: string;
  callback?: SocketCallback<T>;
}): Room | null => {
  const id = roomId ?? socket.data.roomId;
  const room = id ? rooms.get(id) : null;

  if (!room) {
    if (callback) {
      notOk(callback, ERROR_CODES.ROOM_NOT_FOUND);
    } else {
      const err = { error: ERROR_CODES.ROOM_NOT_FOUND };
      socket.emit("room:error", err);
    }

    return null;
  }

  return room;
};

export const isInRoom = <T>(
  playerId: string,
  room: Room,
  callback?: SocketCallback<T>
): Player | null => {
  const player = room.players.find(
    (p) => p.id === playerId
  );

  if (!player) {
    if (callback) {
      notOk(callback, ERROR_CODES.NOT_IN_ROOM);
    }

    return null;
  }

  return player;
};

export const isPlayerAdmin = <T>(
  socket: AppSocket,
  room: Room,
  callback: SocketCallback<T>
) => {
  const isAdmin = socket.id === room.adminId;

  if (!isAdmin) {
    notOk(callback, ERROR_CODES.NOT_ADMIN);
    return false;
  }

  return true;
};

export const getGame = <T>(
  roomId: string,
  callback: SocketCallback<T>
): Game | null => {
  const game = games.get(roomId);

  if (!game) {
    notOk(callback, ERROR_CODES.GAME_NOT_FOUND);
    return null;
  }

  return game;
};

export const getTurn = <T>(
  roomId: string,
  callback: SocketCallback<T>
): Turn | null => {
  const turn = turns.get(roomId);

  if (!turn) {
    notOk(callback, ERROR_CODES.TURN_NOT_FOUND);
    return null;
  }

  return turn;
};

export const gameGuard = <T>(
  socket: AppSocket,
  callback: SocketCallback<T>
) => {
  const room = getRoom({ socket, callback });
  if (!room) return null;

  const player = isInRoom(socket.id, room, callback);
  if (!player) return null;

  const game = getGame(room.id, callback);
  if (!game) return null;

  const find = (p: PlayerState) => p.id === socket.id;
  const state = game.players.find(find);
  if (!state) return null;

  return { room, game, player, state };
};

export const turnGuard = <T>(
  socket: AppSocket,
  callback: SocketCallback<T>
) => {
  const data = gameGuard(socket, callback);
  if (!data) return null;

  const turn = getTurn(data.room.id, callback);
  if (!turn) return null;

  if (Date.now() >= turn.expiresAt) {
    notOk(callback, ERROR_CODES.TURN_EXPIRED);
    return;
  }

  if (turn.currentPlayerId !== socket.id) {
    notOk(callback, ERROR_CODES.NOT_YOUR_TURN);
    return null;
  }

  return { ...data, turn };
};

export const getGameData = (
  io: AppServer,
  roomId: string
) => {
  const room = rooms.get(roomId);
  const game = games.get(roomId);

  if (!room || !game) {
    const error = !room
      ? ERROR_CODES.ROOM_NOT_FOUND
      : ERROR_CODES.GAME_NOT_FOUND;

    io.to(roomId).emit("room:error", { error });
    return null;
  }

  return { room, game };
};

export const getTurnData = (
  io: AppServer,
  roomId: string
) => {
  const gameData = getGameData(io, roomId);
  if (!gameData) return null;

  const turn = turns.get(roomId);

  if (!turn) {
    const err = { error: ERROR_CODES.TURN_NOT_FOUND };
    io.to(roomId).emit("room:error", err);
    return null;
  }

  const { game } = gameData;
  const state = game.players[game.currPlayerIndex];

  return { ...gameData, turn, state };
};
