import { Socket } from "socket.io";
import crypto from "crypto";

import { users, rooms } from "@/stores";

import { Room, ErrorResponse, CreateRoomProps, RoomId, SocketRes, RoomCapacity } from "@/types";

const generateId = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

const checkName = (name: string): ErrorResponse | undefined => {
  const trimmedName = name.trim();

  if (trimmedName.length < 1) 
    return { success: false, error: "NAME_EMPTY" }

  if (trimmedName.length > 15) 
    return { success: false, error: "NAME_MAX_LENGTH" }

  return;
};

const checkCapacity = (numPlayers: number, capacity: RoomCapacity): ErrorResponse | undefined => {
  if (Number(capacity) < numPlayers) {
    return { success: false, error: "CAPACITY_CONFLICT" }
  }

  return;
};

// main functions ---

const create = (socket: Socket, payload: CreateRoomProps): SocketRes<RoomId> => {
  const nameRes = checkName(payload.name);

  if (nameRes) 
    return nameRes;

  let id = generateId();

  while (rooms.has(id)) 
    id = generateId();

  rooms.set(id, {
    id,
    name: payload.name,
    adminId: socket.id,
    capacity: payload.capacity,
    players: [{
      id: socket.id,
      name: users.get(socket.id) ?? "",
      pos: 1,
      joinedAt: new Date().getTime(),
    }],
    state: "WAITING",
    turnDuration: payload.turnDuration,
    rules: payload.rules,
  });

  socket.join(id);
  socket.data.roomId = id;

  return { success: true, data: { roomId: id } }
};

const getAvailable = () => {
  const availableRooms: Room[] = Array.from(rooms.values())
    .filter((room) => room.state === "WAITING");

    return { availableRooms };
};

const join = (socket: Socket, room: Room) => {
  const currPlayers = room.players.length;
  const usedSlots: number[] = [];

  for (let i=0 ; i<currPlayers ; i++) {
    usedSlots.push(room.players[i].pos);
  };

  let currentPos: number = 0;
  for (let i=1; i<5 ; i++) {
    if (!usedSlots.includes(i)) {
      currentPos = i;
      break;
    };
  };

  room.players.push({
    id: socket.id,
    name: users.get(socket.id) ?? "",
    pos: currentPos,
    joinedAt: new Date().getTime(),
  });

  room.players.sort((a,b) => a.pos - b.pos);

  room.state = (currPlayers + 1 === Number(room.capacity)) 
    ? "FULL" 
    : room.state;  

  socket.join(room.id);
  socket.data.roomId = room.id;
};

const leave = (socket: Socket, room: Room): boolean => {
  socket.leave(room.id);
  socket.data.roomId = null;

  if (room.players.length === 1) {
    rooms.delete(room.id); 
    return true;
  };

  const remainingPlayers = room.players.filter(p => p.id !== socket.id);

  if (room.adminId === socket.id) {
    room.adminId = remainingPlayers[0].id;
  };

  room.players = remainingPlayers;

  if (room.state !== "PLAYING") {
    room.state = "WAITING";
  };

  return false;
};

export default {
  create,
  getAvailable,
  join,
  leave,
  checkName,
  checkCapacity
};