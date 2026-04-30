import { gameService, roomService } from "@/services";
import { startTurn, handleExit } from "@/loop/gameLoop";
import {
  getRoom,
  isPlayerInRoom,
  isPlayerAdmin,
} from "@/utils/guards";
import {
  ok,
  notOk,
  broadcastRoomList,
  syncRoom,
} from "@/utils/emiterHelper";

import { AppServer, AppSocket } from "@/types";

export const roomSocket = (
  io: AppServer,
  socket: AppSocket
) => {
  socket.on("room:create", (payload, callback) => {
    const res = roomService.create(payload, socket.id);

    if (res.success) {
      const { roomId } = res.data;

      void socket.join(roomId);
      socket.data.roomId = roomId;

      ok(callback, res.data);
      broadcastRoomList(io, roomService.getAvailable());
    } else {
      notOk(callback, res.error);
    }
  });

  socket.on("room:getAvailable", (callback) => {
    ok(callback, roomService.getAvailable());
  });

  socket.on("room:join", ({ roomId }, callback) => {
    const room = getRoom(socket, roomId, callback);
    if (!room) return;

    if (room.state === "FULL") {
      notOk(callback, "ROOM_IS_FULL");
      return;
    }

    roomService.join(room, socket.id);

    void socket.join(room.id);
    socket.data.roomId = room.id;

    ok(callback, { roomId });
    syncRoom(io, room, roomService.getAvailable());
  });

  socket.on("room:getData", (callback) => {
    const room = getRoom(socket, undefined, callback);
    if (!room) return;

    const isInRoom = isPlayerInRoom(room, socket.id);
    if (!isInRoom) {
      console.log("shouldCheck");
      return;
    }

    ok(callback, room);
  });

  socket.on("room:update", (newData, callback) => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const res = roomService.checkName(newData.name);

    if (res.success) {
      roomService.update(room, newData);

      ok(callback, null);
      syncRoom(io, room, roomService.getAvailable());
    } else {
      notOk(callback, res.error);
    }
  });

  socket.on("room:updateCapacity", (capacity, callback) => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const newCapacity = capacity.capacity;

    const res = roomService.checkCapacity(
      room.players.length,
      newCapacity
    );

    if (res.success) {
      roomService.updateCapacity(room, newCapacity);

      ok(callback, null);
      syncRoom(io, room, roomService.getAvailable());
    } else {
      notOk(callback, res.error);
    }
  });

  socket.on("room:kickPlayer", ({ playerId }, callback) => {
    const room = getRoom(socket, undefined, undefined);
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const kickedSocket = io.sockets.sockets.get(playerId);

    if (!kickedSocket) {
      notOk(callback, "PLAYER_NOT_FOUND");
      syncRoom(io, room, roomService.getAvailable());
      return;
    }

    const isInRoom = isPlayerInRoom(room, kickedSocket.id);
    if (!isInRoom) {
      console.log("shouldCheck");
      return;
    }

    kickedSocket.emit("room:kickedOut");
    handleExit(io, kickedSocket);

    ok(callback, null);
  });

  socket.on("room:leave", () => {
    handleExit(io, socket);
  });

  socket.on("room:startGame", (callback) => {
    const room = getRoom(socket, undefined, callback);
    if (!room) return;

    const isAdmin = isPlayerAdmin(socket, room, callback);
    if (!isAdmin) return;

    const numPlayers = room.players.length;
    const roomCapacity = Number(room.capacity);

    const canStart = roomCapacity <= numPlayers;
    if (!canStart) {
      notOk(callback, "NOT_ENOUGHT_PLAYERS");
      return;
    }

    gameService.createGame(room);

    io.to(room.id).emit("room:gameStarted", {
      roomId: room.id,
    });

    setTimeout(() => {
      startTurn(io, room.id);
    }, 3000);
  });
};
