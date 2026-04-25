import { Socket } from "socket.io";
import crypto from "crypto";

import { users, rooms } from "@/stores";

import { 
  Room,
  CreateRoomProps,
  RoomId, SocketRes,
  RoomCapacity,
  AvailableRooms,
  UpdateRoomProps,
} from "@/types";

const generateId = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

const checkName = (name: string): SocketRes<null> => {
  const trimmedName = name.trim();

  if (trimmedName.length < 1) 
    return { success: false, error: "NAME_EMPTY" }

  if (trimmedName.length > 15) 
    return { success: false, error: "NAME_MAX_LENGTH" }

  return { success: true, data: null };
};

const checkCapacity = (numPlayers: number, capacity: RoomCapacity): SocketRes<null> => {
  if (Number(capacity) < numPlayers) {
    return { success: false, error: "CAPACITY_CONFLICT" }
  }

  return { success: true, data: null };
};

// main functions ---

const create = (socket: Socket, payload: CreateRoomProps): SocketRes<RoomId> => {
  const res = checkName(payload.name);

  if (!res.success) 
    return res;

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

const update = (room: Room, newData: UpdateRoomProps) => {
  room.name = newData.name;
  room.turnDuration = newData.turnDuration;
  room.rules = newData.rules;
};

const updateCapacity = (room: Room, capacity: RoomCapacity) => {
  room.capacity = capacity;
};

const getAvailable = (): AvailableRooms => {
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
  update,
  updateCapacity,
  getAvailable,
  join,
  leave,
  checkName,
  checkCapacity
};