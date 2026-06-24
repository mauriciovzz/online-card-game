import crypto from "crypto";

import { users, rooms } from "@/stores";

import {
  Room,
  CreateRoomProps,
  RoomInfo,
  Player,
  RoomSeat,
} from "@shared/types";
import {
  getSeatPlayer,
  updateRoomState,
} from "@/utils/seatsHelper";

const AI_PLAYER_METADATA = {
  1: {
    id: "AI-RED",
    name: "ROBOT-1",
    pos: 1,
  },
  2: {
    id: "AI-BLUE",
    name: "ROBOT-2",
    pos: 2,
  },
  3: {
    id: "AI-YELLOW",
    name: "ROBOT-3",
    pos: 3,
  },
  4: {
    id: "AI-GREEN",
    name: "ROBOT-4",
    pos: 4,
  },
} as const;

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

  const joinedAt = new Date().getTime();

  const otherSeats: RoomSeat[] = [];
  const aiPlayers: Player[] = [];

  for (let i = 2; i < 5; i++) {
    const seat = payload.seats.find(
      (seat) => seat.pos === i
    );
    if (!seat) break;

    if (seat.type === "ai") {
      const meta = AI_PLAYER_METADATA[i as 2 | 3 | 4];

      aiPlayers.push({
        ...meta,
        type: "ai",
        joinedAt,
      });
    }

    otherSeats.push(seat);
  }

  const state =
    aiPlayers.length ===
    otherSeats.filter((s) => s.type).length
      ? "FULL"
      : "WAITING";

  rooms.set(id, {
    id,
    state,
    adminId: playerId,

    name: payload.name,
    turnDuration: payload.turnDuration,
    rules: payload.rules,

    seats: [{ pos: 1, type: "human" }, ...otherSeats],
    players: [
      {
        id: playerId,
        name: users.get(playerId) ?? "",
        pos: 1,
        type: "human",
        joinedAt,
      },
      ...aiPlayers,
    ],
  });

  return id;
};

const update = (room: Room, newData: RoomInfo) => {
  room.name = newData.name;
  room.turnDuration = newData.turnDuration;
  room.rules = newData.rules;
};

const updateSeat = (
  room: Room,
  { pos, type }: RoomSeat
) => {
  const index = room.seats.findIndex((s) => s.pos === pos);

  if (room.seats[index].type === "ai" && !type) {
    const aiPlayer = getSeatPlayer(room, pos);
    if (!aiPlayer) return;

    leave(room, aiPlayer.id);
  }

  if (type === "ai") {
    const meta = AI_PLAYER_METADATA[pos as 1 | 2 | 3 | 4];

    room.players.push({
      ...meta,
      type: "ai",
      joinedAt: new Date().getTime(),
    });
  }

  room.seats.splice(index, 1, { pos, type });

  updateRoomState(room);
};

const getAvailable = () => {
  const availableRooms: Room[] = Array.from(
    rooms.values()
  ).filter((room) => room.state === "WAITING");

  return { availableRooms };
};

const join = (room: Room, playerId: string) => {
  const { players } = room;

  const avalilableSeat = room.seats
    .filter((s) => s.type === "human")
    .find((s) => !players.some((p) => p.pos === s.pos));

  if (!avalilableSeat) return false;

  room.players.push({
    id: playerId,
    type: "human",
    name: users.get(playerId) ?? "",
    pos: avalilableSeat.pos,
    joinedAt: new Date().getTime(),
  });

  updateRoomState(room);

  return true;
};

const leave = (room: Room, playerId: string) => {
  room.players = room.players.filter(
    (p) => p.id !== playerId
  );

  if (room.adminId === playerId) {
    const nextAdmin = room.players
      .filter((p) => p.type === "human")
      .sort((a, b) => a.joinedAt - b.joinedAt)[0];

    room.adminId = nextAdmin.id;
  }

  if (room.state !== "PLAYING") {
    updateRoomState(room);
  }

  return true;
};

export default {
  create,
  update,
  updateSeat,
  getAvailable,
  join,
  leave,
};
