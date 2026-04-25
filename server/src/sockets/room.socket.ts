import { Server, Socket } from "socket.io";

import { roomService } from "@/services";
import gameLoop from "@/loop/gameLoop";
import {
  getRoom,
  isPlayerInRoom,
  isPlayerAdmin,
} from "@/utils/guards"
import {
  ok,
  broadcastRoomList,
  syncRoom,
} from "@/utils/emiterHelper";

import { 
  AvailableRooms,
  CreateRoomProps,
  PlayerId,
  Room,
  RoomCapacity,
  RoomId,
  SocketCallback,
  UpdateRoomProps,
} from "@/types";

export const roomSocket = (io: Server, socket: Socket) => {

  socket.on(
    "room:create", 
    (
      payload: CreateRoomProps,
      callback: SocketCallback<RoomId>
    ) => {
    const res = roomService.create(socket, payload);
  
    if (res.success) {
      ok(callback, res.data);
      broadcastRoomList(io, roomService.getAvailable());
    } else {
      callback({ success: false, error: res.error });    
    }
  });

  socket.on(
    "room:getAvailable", 
    (
      callback: SocketCallback<AvailableRooms>
    ) => {
      ok(callback, roomService.getAvailable());
  });

  socket.on(
    "room:join", 
    (
      { roomId }: RoomId,
      callback: SocketCallback<RoomId>
    ) => {
      const room = getRoom(socket, roomId, callback);
      if (!room) return;

      if (room.state === "FULL") {
        callback({ success: false, error: "ROOM_IS_FULL" })
        return;
      };

      roomService.join(socket, room);

      ok(callback, { roomId });
      syncRoom(io, room, roomService.getAvailable());
  });

  socket.on(
    "room:getInfo", 
    (
      callback: SocketCallback<Room>
    ) => {
      const room = getRoom(socket, undefined, callback);
      if (!room) return;

      const isInRoom = isPlayerInRoom(socket, room, callback);
      if (!isInRoom) return;

      ok(callback, room);
  });

  socket.on(
    "room:update",
    (
      newData: UpdateRoomProps,
      callback: SocketCallback<null>
    ) => {
      console.log("update")
      const room = getRoom(socket, undefined, undefined);
      if (!room) return;

      const isAdmin = isPlayerAdmin(socket, room, callback);
      if (!isAdmin) return;

      const res = roomService.checkName(newData.name);

      if (res.success) {
        roomService.update(room, newData);

        ok(callback, null)   
        syncRoom(io, room, roomService.getAvailable()); 
      } else {
        callback(res);
      }        
  });

  socket.on(
    "room:updateCapacity", 
    (
      { capacity }: { capacity: RoomCapacity },
      callback: SocketCallback<null>
    ) => {
      console.log("updateCapacity")
      const room = getRoom(socket, undefined, undefined);
      if (!room) return;

      const isAdmin = isPlayerAdmin(socket, room, callback);
      if (!isAdmin) return;

      const res = roomService.checkCapacity(
        room.players.length, 
        capacity,
      );

      if (res.success) {
        roomService.updateCapacity(room, capacity);

        ok(callback, null)
        syncRoom(io, room, roomService.getAvailable());
      } else {
        callback(res);
      } 
  });

  socket.on(
    "room:kickPlayer", 
    (
      { playerId }: PlayerId,
      callback: SocketCallback<null>
    ) => {
      console.log("kickPlayer")
      const room = getRoom(socket, undefined, undefined);
      if (!room) return;

      const isAdmin = isPlayerAdmin(socket, room, callback);
      if (!isAdmin) return;

      const kickedSocket = io.sockets.sockets.get(playerId);

      if (!kickedSocket) {
        callback({ success: false, error: "PLAYER_NOT_FOUND" });  
        syncRoom(io, room, roomService.getAvailable());
        return;
      }

      const isInRoom = isPlayerInRoom(kickedSocket, room, callback);
      if (!isInRoom) return;
 
      kickedSocket.emit("room:kickedOut");    
      gameLoop.handlePlayerExit(io, kickedSocket);

      ok(callback, null)   
    }
  );

  socket.on(
    "room:leave", 
    (
      { roomId }: RoomId
    ) => {
      const room = getRoom(socket, roomId, undefined);
      if (!room) return;

      const isInRoom = room.players.some((p) => p.id === socket.id);

      if (isInRoom) {
        gameLoop.handlePlayerExit(io, socket);
      } else {
        syncRoom(io, room, roomService.getAvailable());          
      }
    }
  );

};
