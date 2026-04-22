import { Server, Socket } from "socket.io";

import { roomService } from "@/services";
import gameLoop from "@/loop/gameLoop";
import { checkRoom, ensurePlayerInRoom } from "@/utils/guards"
import { emitError, broadcastRoomList, emit, syncRoom } from "@/utils/emiterHelper";

import { CreateRoomProps, ErrorResponse, RoomCapacity, RoomId, SocketRes, UpdateRoomProps } from "@/types";

export const roomSocket = (io: Server, socket: Socket) => {

  // done
  socket.on(
    "room:create", 
    (
      payload: CreateRoomProps,
      callback: (res: SocketRes<RoomId>) => void
    ) => {
    const res = roomService.create(socket, payload);
  
    if (res.success) {
      callback({
        success: true,
        data: res.data,
      });

      broadcastRoomList(io, roomService.getAvailable());
    } else {
      callback({
        success: false,
        error: res.error,
      });    
    }
  });

  // done
  socket.on("room:getAvailable", () => {
    emit(socket, "room:availableRooms", roomService.getAvailable());
  });

  // done
  socket.on("room:getInfo", () => {
    checkRoom({ socket, handler: (room) => {
      emit(socket, "room:currentInfo", room);
    }});
  });

  // done
  socket.on("room:join", ({ roomId }) => {
    checkRoom({ socket, roomId, handler: (room) => {
      if (room.state === "FULL") {
        emitError(socket, "room:error", "ROOM_IS_FULL");
        return;
      };

      roomService.join(socket, room);
      emit(socket, "room:joined", { roomId });

      syncRoom(io, room, roomService.getAvailable());
    }});
  });

  // done
  socket.on(
    "room:update",
    (
      newData: UpdateRoomProps,
      callback: (res: SocketRes<null>) => void
    ) => {
    checkRoom({socket, handler: (room) => {
      const res = roomService.checkName(room.name);

      if (res) {
        callback(res);
      } else {
        room.name = newData.name;
        room.turnDuration = newData.turnDuration;
        room.rules = newData.rules;

        syncRoom(io, room, roomService.getAvailable()); 

        callback({
          success: true,
          data: null,
        })    
      }
    }});
  });

  // done
  socket.on(
    "room:updateCapacity", 
    (
      { capacity }: { capacity: RoomCapacity },
      callback: (res: ErrorResponse) => void
    ) => {
    checkRoom({ socket, handler: (room) => {
      const res = roomService.checkCapacity(
        room.players.length, 
        capacity,
      );

      if (res) {
        callback(res);
      } else {
        room.capacity = capacity;
        syncRoom(io, room, roomService.getAvailable());          
      }  
    }});
  });

  //
  socket.on(
    "room:kickPlayer", 
    (
      { playerId }: { playerId: string },
      callback: (res: ErrorResponse) => void
    ) => {
    checkRoom({ socket, handler: (room) => {      
      const kickedSocket = io.sockets.sockets.get(playerId);

      if (!kickedSocket) {
        syncRoom(io, room, roomService.getAvailable());
        callback({
          success: false,
          error: "PLAYER_NOT_FOUND"
        });  
        return;
      }

      ensurePlayerInRoom({socket, room, callback, handler: () => {
        kickedSocket.emit("room:kickedOut");    
         
        gameLoop.handlePlayerExit(io, kickedSocket);
      }}) 
    }})
  });

  // 
  socket.on("room:leave", ({ roomId }) => {
    checkRoom({ socket, roomId, handler: (room) => {
      const isInRoom = room.players.some((p) => p.id === socket.id);

      if (!isInRoom) {
        emitError(socket, "room:left", "NOT_IN_ROOM");
        return; 
      };

      gameLoop.handlePlayerExit(io, socket);
    }});
  });

};
