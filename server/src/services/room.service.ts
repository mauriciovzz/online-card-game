import crypto from "crypto";

import { users, rooms } from "@/stores";

import {
  Room,
  CreateRoomProps,
  RoomCapacity,
  RoomInfo,
  Player,
  PlayerPos,
} from "@shared/types";

const generateId = () => {
  return crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();
};

const create = (
  payload: CreateRoomProps,
  playerId: string
) => {
  let id = generateId();
  while (rooms.has(id)) id = generateId();

  rooms.set(id, {
    id,
    name: payload.name,
    adminId: playerId,
    capacity: payload.capacity,
    players: [
      {
        id: playerId,
        name: users.get(playerId) ?? "",
        pos: 1,
        joinedAt: new Date().getTime(),
      },
    ],
    state: "WAITING",
    turnDuration: payload.turnDuration,
    rules: payload.rules,
  });

  return id;
};

const update = (room: Room, newData: RoomInfo) => {
  room.name = newData.name;
  room.turnDuration = newData.turnDuration;
  room.rules = newData.rules;
};

const updateCapacity = (
  room: Room,
  capacity: RoomCapacity
) => {
  const isFull = room.players.length === Number(capacity);

  room.capacity = capacity;
  room.state = isFull ? "FULL" : "WAITING";
};

const getAvailable = () => {
  const availableRooms: Room[] = Array.from(
    rooms.values()
  ).filter((room) => room.state === "WAITING");

  return { availableRooms };
};

const join = (room: Room, playerId: string) => {
  const numPlayers = room.players.length + 1;

  room.players.push({
    id: playerId,
    name: users.get(playerId) ?? "",
    pos: numPlayers as PlayerPos,
    joinedAt: new Date().getTime(),
  });

  room.players.sort((a, b) => a.pos - b.pos);

  const roomFull = numPlayers === Number(room.capacity);
  room.state = roomFull ? "FULL" : room.state;
};

const leave = (room: Room, playerId: string) => {
  const filter = (p: Player) => p.id !== playerId;
  const remainingPlayers = room.players.filter(filter);

  if (room.adminId === playerId) {
    room.adminId = remainingPlayers[0].id;
  }

  room.players = remainingPlayers.map((p, index) => {
    p.pos = (index + 1) as PlayerPos;
    return p;
  });

  if (room.state !== "PLAYING") {
    room.state = "WAITING";
  }

  return false;
};

export default {
  create,
  update,
  updateCapacity,
  getAvailable,
  join,
  leave,
};
