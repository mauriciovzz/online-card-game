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

const COMPUTER_METADATA: {
  id: string;
  name: string;
  pos: 2 | 3 | 4;
}[] = [
  {
    id: "PC-BLUE",
    name: "ROBOT-2",
    pos: 2,
  },
  {
    id: "PC-YELLOW",
    name: "ROBOT-3",
    pos: 3,
  },
  {
    id: "PC-GREEN",
    name: "ROBOT-4",
    pos: 4,
  },
];

const create = (
  payload: CreateRoomProps,
  playerId: string
) => {
  let id = generateId();
  while (rooms.has(id)) id = generateId();

  const aiPlayers: Player[] = payload.players
    .filter((p) => p.type === "ai")
    .map((p) => ({
      ...COMPUTER_METADATA[p.pos - 2],
      type: "ai",
      joinedAt: new Date().getTime(),
    }));

  const players: Player[] = [
    {
      id: playerId,
      name: users.get(playerId) ?? "",
      type: "human",
      pos: 1,
      joinedAt: new Date().getTime(),
    },
    ...aiPlayers,
  ];

  const capacity = (payload.players.filter(
    (p) => p.type !== undefined
  ).length + 1) as RoomCapacity;

  rooms.set(id, {
    id,
    name: payload.name,
    adminId: playerId,
    capacity,
    players,
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
  const isFull = room.players.length === capacity;

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
    type: "human",
    name: users.get(playerId) ?? "",
    pos: numPlayers as PlayerPos,
    joinedAt: new Date().getTime(),
  });

  room.players.sort((a, b) => a.pos - b.pos);

  const roomFull = numPlayers === room.capacity;
  room.state = roomFull ? "FULL" : room.state;
};

const leave = (room: Room, playerId: string) => {
  const filter = (p: Player) => p.id !== playerId;
  const remainingPlayers = room.players.filter(filter);

  if (room.adminId === playerId) {
    const firstHumanIndex = remainingPlayers.findIndex(
      (p) => p.type === "human"
    );

    room.adminId = remainingPlayers[firstHumanIndex].id;
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
