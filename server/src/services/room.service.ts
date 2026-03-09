import { Socket } from "socket.io";
import { Room, CreateRoomProps, LeaveRoomRes } from "@/types";
import { users, rooms } from "@/stores";
import crypto from "crypto";

const colors = ["#ff5454", "#ffac00", "#54ac54", "#5454ff"];

const generateId = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// main functions ---

const create = (socket: Socket, payload: CreateRoomProps) => {
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
      color: colors[0],
    }],
    state: "WAITING",
    turnDuration: payload.turnDuration,
    rules: payload.rules,
  });

  socket.join(id);
  socket.data.roomId = id;

  return id;
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
    color: colors[currentPos - 1],
  });

  room.players.sort((a,b) => a.pos - b.pos);

  room.state = (currPlayers + 1 === Number(room.capacity)) 
    ? "FULL" 
    : room.state;  

  socket.join(room.id);
  socket.data.roomId = room.id;
};

const leave = (socket: Socket, room: Room): LeaveRoomRes => {
  socket.leave(room.id);
  socket.data.roomId = null;

  if (room.players.length === 1) {
    rooms.delete(room.id); 
    return { type: "ROOM_DELETED", roomId: room.id };
  };

  const remainingPlayers = room.players.filter(p => p.id !== socket.id);

  if (room.adminId === socket.id) {
    room.adminId = remainingPlayers[0].id;
  };

  room.players = remainingPlayers;

  if (room.state !== "PLAYING") {
    room.state = "WAITING";
  };

  return { type: "ROOM_LEFT", room };
};

export default {
  create,
  getAvailable,
  join,
  leave,
};