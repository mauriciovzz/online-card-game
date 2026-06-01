import { games, rooms, turns, users } from "@/stores";
import { notOk } from "./emiterHelper";

import {
  Room,
  Game,
  Turn,
  Player,
  RoomCapacity,
  PlayerState,
} from "@shared/types";
import {
  AppServer,
  AppSocket,
  SocketCallback,
} from "@/types";

export const checkUserName = <T>(
  newName: string,
  callback: SocketCallback<T>
) => {
  if (newName.length < 1) {
    notOk(callback, "NAME_EMPTY");
    return false;
  }

  if (newName.length > 10) {
    notOk(callback, "USER_MAX_LENGTH");
    return false;
  }

  const isTaken = [...users.values()].includes(newName);

  if (isTaken) {
    notOk(callback, "NAME_TAKEN");
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
    notOk(callback, "NAME_EMPTY", "VALIDATION");
    return false;
  }

  if (trimmedName.length > 15) {
    notOk(callback, "ROOM_MAX_LENGTH", "VALIDATION");
    return false;
  }

  return true;
};

export const isCapacityOk = <T>(
  numPlayers: number,
  capacity: RoomCapacity,
  callback: SocketCallback<T>
) => {
  if (Number(capacity) < numPlayers) {
    notOk(callback, "CAPACITY_CONFLICT", "VALIDATION");
    return false;
  }

  return true;
};

// werid is in room? checking socket here
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
      notOk(callback, "ROOM_NOT_FOUND");
    } else {
      socket.emit("room:error", {
        error: "ROOM_NOT_FOUND",
      });
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
      notOk(callback, "NOT_IN_ROOM");
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
    notOk(callback, "NOT_ADMIN");
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
    notOk(callback, "GAME_NOT_FOUND");
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
    notOk(callback, "TURN_NOT_FOUND");
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

  if (turn.currentPlayerId !== socket.id) {
    notOk(callback, "NOT_YOUR_TURN");
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
      ? "ROOM_NOT_FOUND"
      : "GAME_NOT_FOUND";

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
    const error = { error: "TURN_NOT_FOUND" };
    io.to(roomId).emit("room:error", error);
    return null;
  }

  return { ...gameData, turn };
};
