import crypto from "crypto";

import { users, rooms } from "@/stores";

import {
  Room,
  CreateRoomProps,
  RoomId,
  SocketRes,
  RoomCapacity,
  UpdateRoomProps,
  PlayerSlot,
} from "@/types";

const generateId = () => {
  return crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();
};

const checkName = (name: string): SocketRes<null> => {
  const trimmedName = name.trim();

  if (trimmedName.length < 1)
    return { success: false, error: "NAME_EMPTY" };

  if (trimmedName.length > 15)
    return { success: false, error: "NAME_MAX_LENGTH" };

  return { success: true, data: null };
};

const checkCapacity = (
  numPlayers: number,
  capacity: RoomCapacity
): SocketRes<null> => {
  if (Number(capacity) < numPlayers) {
    return { success: false, error: "CAPACITY_CONFLICT" };
  }

  return { success: true, data: null };
};

// --------------------------------------------------------------

const create = (
  payload: CreateRoomProps,
  playerId: string
): SocketRes<RoomId> => {
  const res = checkName(payload.name);

  if (!res.success) return res;

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

  return { success: true, data: { roomId: id } };
};

const update = (room: Room, newData: UpdateRoomProps) => {
  room.name = newData.name;
  room.turnDuration = newData.turnDuration;
  room.rules = newData.rules;
};

const updateCapacity = (
  room: Room,
  capacity: RoomCapacity
) => {
  room.capacity = capacity;
};

const getAvailable = () => {
  const availableRooms: Room[] = Array.from(
    rooms.values()
  ).filter((room) => room.state === "WAITING");

  return { availableRooms };
};

const join = (room: Room, playerId: string) => {
  const currPlayers = room.players.length;
  const usedSlots: number[] = [];

  for (let i = 0; i < currPlayers; i++) {
    usedSlots.push(room.players[i].pos);
  }

  let currentPos = 0;
  for (let i = 1; i < 5; i++) {
    if (!usedSlots.includes(i)) {
      currentPos = i;
      break;
    }
  }

  room.players.push({
    id: playerId,
    name: users.get(playerId) ?? "",
    pos: currentPos,
    joinedAt: new Date().getTime(),
  });

  room.players.sort((a, b) => a.pos - b.pos);

  room.state =
    currPlayers + 1 === Number(room.capacity)
      ? "FULL"
      : room.state;
};

const leave = (room: Room, playerId: string) => {
  if (room.players.length === 1) {
    rooms.delete(room.id);
    return true;
  }

  const filter = (p: PlayerSlot) => p.id !== playerId;
  const remainingPlayers = room.players.filter(filter);

  if (room.adminId === playerId) {
    room.adminId = remainingPlayers[0].id;
  }

  room.players = remainingPlayers;

  if (room.state !== "PLAYING") {
    room.state = "WAITING";
  }

  return false;
};

export default {
  checkName,
  checkCapacity,

  create,
  update,
  updateCapacity,
  getAvailable,
  join,
  leave,
};
