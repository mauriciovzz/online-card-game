import crypto from "crypto";

import { users, rooms } from "@/stores";

import {
  Room,
  CreateRoomProps,
  RoomInfo,
  Player,
  RoomSeat,
  PlayerState,
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

        wins: 0,
        points: 0,
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

        wins: 0,
        points: 0,
      },
      ...aiPlayers,
    ],
    currWinner: null,
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
      wins: 0,
      points: 0,
    });
  }

  room.seats.splice(index, 1, { pos, type });

  updateRoomState(room);
};

const updateScore = (
  room: Room,
  winnerId: string,
  losers: PlayerState[]
) => {
  const player = room.players.find(
    (p) => p.id === winnerId
  );

  if (player) {
    const score = losers.reduce((total, player) => {
      const handScore = player.cards.reduce(
        (score, card) => {
          switch (card.type) {
            case "NUMBER":
              return score + card.number;

            case "SKIP":
            case "REVERSE":
            case "DRAW_TWO":
              return score + 20;

            case "DRAW_FOUR":
            case "WILD_CARD":
              return score + 50;

            default:
              return score;
          }
        },
        0
      );

      return total + handScore;
    }, 0);

    player.wins += 1;
    player.points += score;
  }
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
    wins: 0,
    points: 0,
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

  if (room.currWinner === playerId) {
    room.currWinner = null;
  }

  return true;
};

export default {
  create,
  update,
  updateSeat,
  updateScore,
  getAvailable,
  join,
  leave,
};
