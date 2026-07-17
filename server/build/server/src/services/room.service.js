"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const stores_1 = require("../stores");
const seatsHelper_1 = require("../utils/seatsHelper");
const BOTS_METADATA = {
    1: {
        id: "BOT-1",
        name: "BOT-1",
        pos: 1,
    },
    2: {
        id: "BOT-2",
        name: "BOT-2",
        pos: 2,
    },
    3: {
        id: "BOT-3",
        name: "BOT-3",
        pos: 3,
    },
    4: {
        id: "BOT-4",
        name: "BOT-4",
        pos: 4,
    },
};
const generateId = () => {
    return crypto_1.default
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();
};
const create = (payload, playerId) => {
    var _a;
    let id = generateId();
    while (stores_1.rooms.has(id))
        id = generateId();
    const joinedAt = new Date().getTime();
    const otherSeats = [];
    const bots = [];
    for (let i = 2; i < 5; i++) {
        const seat = payload.seats.find((seat) => seat.pos === i);
        if (!seat)
            break;
        if (seat.type === "bot") {
            const meta = BOTS_METADATA[i];
            bots.push(Object.assign(Object.assign({}, meta), { type: "bot", joinedAt, wins: 0, points: 0 }));
        }
        otherSeats.push(seat);
    }
    const state = bots.length === otherSeats.filter((s) => s.type).length
        ? "FULL"
        : "WAITING";
    stores_1.rooms.set(id, {
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
                name: (_a = stores_1.users.get(playerId)) !== null && _a !== void 0 ? _a : "",
                pos: 1,
                type: "human",
                joinedAt,
                wins: 0,
                points: 0,
            },
            ...bots,
        ],
        currWinner: null,
    });
    return id;
};
const update = (room, newData) => {
    room.name = newData.name;
    room.turnDuration = newData.turnDuration;
    room.rules = newData.rules;
};
const updateSeat = (room, { pos, type }) => {
    const index = room.seats.findIndex((s) => s.pos === pos);
    if (room.seats[index].type === "bot" && !type) {
        const bot = (0, seatsHelper_1.getSeatPlayer)(room, pos);
        if (!bot)
            return;
        leave(room, bot.id);
    }
    if (type === "bot") {
        const meta = BOTS_METADATA[pos];
        room.players.push(Object.assign(Object.assign({}, meta), { type: "bot", joinedAt: new Date().getTime(), wins: 0, points: 0 }));
    }
    room.seats.splice(index, 1, { pos, type });
    (0, seatsHelper_1.updateRoomState)(room);
};
const updateScore = (room, winnerId, losers) => {
    const player = room.players.find((p) => p.id === winnerId);
    if (player) {
        const score = losers.reduce((total, player) => {
            const handScore = player.cards.reduce((score, card) => {
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
            }, 0);
            return total + handScore;
        }, 0);
        player.wins += 1;
        player.points += score;
        return score;
    }
    return 0;
};
const resetScores = (room) => {
    room.currWinner = null;
    for (const player of room.players) {
        player.wins = 0;
        player.points = 0;
    }
};
const getAvailable = () => {
    const availableRooms = Array.from(stores_1.rooms.values()).filter((room) => room.state === "WAITING");
    return { availableRooms };
};
const join = (room, playerId) => {
    var _a;
    const { players } = room;
    const avalilableSeat = room.seats
        .filter((s) => s.type === "human")
        .find((s) => !players.some((p) => p.pos === s.pos));
    if (!avalilableSeat)
        return false;
    room.players.push({
        id: playerId,
        type: "human",
        name: (_a = stores_1.users.get(playerId)) !== null && _a !== void 0 ? _a : "",
        pos: avalilableSeat.pos,
        joinedAt: new Date().getTime(),
        wins: 0,
        points: 0,
    });
    (0, seatsHelper_1.updateRoomState)(room);
    return true;
};
const leave = (room, playerId) => {
    room.players = room.players.filter((p) => p.id !== playerId);
    if (room.adminId === playerId) {
        const nextAdmin = room.players
            .filter((p) => p.type === "human")
            .sort((a, b) => a.joinedAt - b.joinedAt)[0];
        room.adminId = nextAdmin.id;
    }
    if (room.state !== "PLAYING") {
        (0, seatsHelper_1.updateRoomState)(room);
    }
    if (room.currWinner === playerId) {
        room.currWinner = null;
    }
    return true;
};
exports.default = {
    create,
    update,
    updateSeat,
    updateScore,
    resetScores,
    getAvailable,
    join,
    leave,
};
