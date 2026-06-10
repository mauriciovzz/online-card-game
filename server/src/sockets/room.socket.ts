import { gameService, roomService } from "@/services";
import { startTurn, handleExit } from "@/loop/gameLoop";
import {
  getRoom,
  isCapacityOk,
  isInRoom,
  isPlayerAdmin,
  checkRoomName,
} from "@/utils/guards";
import {
  ok,
  notOk,
  broadcastRoomList,
  syncRoom,
} from "@/utils/emiterHelper";

import { ERROR_CODES } from "@shared/constants/errorCodes";
import { AppServer, AppSocket } from "@/types";

export const roomSocket = (
  io: AppServer,
  socket: AppSocket
) => {
  socket.on("room:create", (payload, callback) => {
    const isOk = checkRoomName(payload.name, callback);
    if (!isOk) return;

    const roomId = roomService.create(payload, socket.id);

    void socket.join(roomId);
    socket.data.roomId = roomId;

    ok(callback, { roomId });
    broadcastRoomList(io, roomService.getAvailable());
  });

  socket.on("room:getAvailable", (callback) => {
    ok(callback, roomService.getAvailable());
  });

  socket.on("room:join", ({ roomId }, callback) => {
    const room = getRoom({ socket, roomId, callback });
    if (!room) return;

    if (room.state === "FULL") {
      notOk(callback, ERROR_CODES.ROOM_FULL);
      return;
    }

    roomService.join(room, socket.id);

    void socket.join(room.id);
    socket.data.roomId = room.id;

    ok(callback, { roomId });
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

  socket.on("room:updateCapacity", (newData, callback) => {
    const room = getRoom({ socket });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const players = room.players.length;
    const newCap = newData.capacity;

    const isOk = isCapacityOk(players, newCap, callback);
    if (!isOk) return;

    roomService.updateCapacity(room, newCap);

    ok(callback, null);
    syncRoom(io, room, roomService.getAvailable());
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
    gameService.createGame(room);

    ok(callback, null);
    socket.to(room.id).emit("room:gameStarted", null);

    setTimeout(() => {
      startTurn(io, room.id);
    }, 1000);
  });

  socket.on("room:kickPlayer", ({ playerId }, callback) => {
    const room = getRoom({ socket, callback });
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const memberSocket = io.sockets.sockets.get(playerId);
    if (!memberSocket) {
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

  socket.on("room:leave", () => {
    handleExit(io, socket);
  });
};
