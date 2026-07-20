import { gameService, roomService } from "@/services";
import { startTurn, handleExit, endGame } from "@/loop/gameLoop";
import {
  getRoom,
  isInRoom,
  isPlayerAdmin,
  checkRoomName,
  checkSeatsCount,
  isSeatTakenByHuman,
  isSeatTaken,
} from "@/utils/guards";
import {
  ok,
  notOk,
  broadcastRoomList,
  syncRoom,
  emitScoreReset,
} from "@/utils/emiterHelper";

import { ERROR_CODES } from "@shared/constants";
import { AppServer, AppSocket } from "@/types";

export const roomSocket = (io: AppServer, socket: AppSocket) => {
  socket.on("room:getAvailable", (callback) => {
    ok(callback, roomService.getAvailable());
  });

  socket.on("room:create", (payload, callback) => {
    const isFree = checkRoomName(payload.name, callback);
    if (!isFree) return;

    const isOk = checkSeatsCount(payload.seats, callback);
    if (!isOk) return;

    const roomId = roomService.create(payload, socket.id);

    void socket.join(roomId);
    socket.data.roomId = roomId;

    ok(callback, { roomId });
    broadcastRoomList(io, roomService.getAvailable());
  });

  socket.on("room:join", ({ roomId }, callback) => {
    const room = getRoom({ socket, roomId, callback });
    if (!room) return;

    if (room.state !== "WAITING") {
      notOk(callback, ERROR_CODES.GAME_STARTED);
    }

    const success = roomService.join(room, socket.id);

    if (success) {
      void socket.join(room.id);
      socket.data.roomId = room.id;

      ok(callback, { roomId });
    } else {
      notOk(callback, ERROR_CODES.ROOM_FULL);
    }

    syncRoom(io, room, roomService.getAvailable());
  });

  socket.on("room:getData", ({ roomId }, callback) => {
    const room = getRoom({ socket, roomId, callback });
    if (!room) return;

    const inRoom = isInRoom(socket.id, room, callback);
    if (!inRoom) return;

    ok(callback, room);
  });

  socket.on("room:update", (newData, callback) => {
    const room = getRoom({ socket, callback });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const nameOk = checkRoomName(newData.name, callback);
    if (!nameOk) return;

    roomService.update(room, newData);

    ok(callback, null);
    syncRoom(io, room, roomService.getAvailable());
  });

  socket.on("room:openSeat", ({ pos, type }, callback) => {
    const room = getRoom({ socket });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const isTaken = isSeatTaken(room, pos, callback);
    if (isTaken) return;

    roomService.updateSeat(room, { pos, type });

    ok(callback, null);
    syncRoom(io, room, roomService.getAvailable());
  });

  socket.on("room:closeSeat", ({ pos }, callback) => {
    const room = getRoom({ socket });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const isTaken = isSeatTakenByHuman(room, pos, callback);
    if (isTaken) return;

    roomService.updateSeat(room, { pos, type: undefined });

    ok(callback, null);
    syncRoom(io, room, roomService.getAvailable());
  });

  socket.on("room:kickPlayer", ({ pos }, callback) => {
    const room = getRoom({ socket, callback });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const playerId = room.players.find((p) => p.pos === pos)?.id;

    const memberSocket = io.sockets.sockets.get(playerId ?? "");

    if (!playerId || !memberSocket) {
      notOk(callback, ERROR_CODES.PLAYER_NOT_FOUND);
      syncRoom(io, room, roomService.getAvailable());
      return;
    }

    const inRoom = isInRoom(memberSocket.id, room);
    if (!inRoom) {
      notOk(callback, ERROR_CODES.PLAYER_NOT_FOUND);
      syncRoom(io, room, roomService.getAvailable());
      return;
    }

    memberSocket.emit("room:kickedOut", null);
    handleExit(io, memberSocket);

    ok(callback, null);
  });

  socket.on("room:resetScores", (callback) => {
    const room = getRoom({ socket, callback });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    roomService.resetScores(room);

    ok(callback, room);
    emitScoreReset(socket, room);
  });

  socket.on("room:startGame", (callback) => {
    const room = getRoom({ socket, callback });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    if (room.players.length === 1) {
      notOk(callback, ERROR_CODES.NOT_ENOUGH_PLAYERS);
      return;
    }

    room.state = "PLAYING";
    syncRoom(io, room, roomService.getAvailable());

    gameService.createGame(room);

    ok(callback, null);
    socket.to(room.id).emit("room:gameStarted", null);

    setTimeout(() => {
      startTurn(io, room.id);
    }, 1000);
  });

  socket.on("room:stopGame", (callback) => {
    const room = getRoom({ socket, callback });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    endGame(io, room);
  });

  socket.on("room:leave", () => {
    handleExit(io, socket);
  });
};
