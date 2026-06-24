import { PlayerPos, Room } from "@shared/types";

export const getSeatPlayer = (room: Room, pos: PlayerPos) =>
  room.players.find((p) => p.pos === pos);

export const isSeatOccupied = (
  room: Room,
  pos: PlayerPos
) => !!getSeatPlayer(room, pos);

export const isRoomFull = (room: Room) =>
  room.seats
    .filter((seat) => seat.type)
    .every((seat) =>
      room.players.some((player) => player.pos === seat.pos)
    );

export const updateRoomState = (room: Room) => {
  room.state = isRoomFull(room) ? "FULL" : "WAITING";
};
