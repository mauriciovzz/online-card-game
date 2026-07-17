import { useMemo, useState } from "react";
import { Stack } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import { GAME_COLORS, PLAYER_TYPES } from "@/constants";
import { useUpdateSeats } from "./useUpdateSeats";
import { LabelWithPopover } from "@/components";
import {
  SeatCreator,
  SeatGrid,
  PlayerContent,
  SeatFrame,
} from "../components";

import type {
  Player,
  PlayerType,
  Room,
} from "@shared/types";

interface Props {
  room: Room;
}

export const SeatUpdater = ({ room }: Props) => {
  const [seatError, setSeatError] = useState("");

  const { openSeat, closeSeat, kickPlayerOut } =
    useUpdateSeats(setSeatError);

  const playersByPos = useMemo(() => {
    const map: Partial<Record<number, Player>> = {};

    room.players.forEach((p) => {
      map[p.pos] = p;
    });

    return map;
  }, [room.players]);

  return (
    <Stack w="100%" gap={0}>
      <LabelWithPopover
        text="room.seats.title"
        description={{
          title: "room.seats.updateTitle",
          text: "room.seats.updateDescription",
        }}
        data={PLAYER_TYPES}
        error={seatError}
      />

      <SeatGrid>
        {room.seats.map((seat) => {
          const { pos, type } = seat;

          const isAvailable = type !== undefined;
          const player = playersByPos[pos];

          const hasPlayer = player?.type === "human";

          const color = GAME_COLORS[pos - 1].hex;

          if (player?.id === room.adminId) {
            return (
              <SeatFrame
                key={color}
                pos={pos}
                color={color}
              >
                <PlayerContent
                  text={player.name}
                  color={color}
                />
              </SeatFrame>
            );
          }

          if (!isAvailable) {
            return (
              <SeatCreator
                key={color}
                color={color}
                pos={pos}
                onSelect={(type: PlayerType) =>
                  openSeat({ pos, type })
                }
              />
            );
          }

          return (
            <SeatFrame
              key={color}
              pos={pos}
              color={color}
              action={{
                icon: hasPlayer ? IconX : undefined,
                corner: true,
                onClick: hasPlayer
                  ? () => kickPlayerOut(pos)
                  : () => closeSeat(pos),
              }}
            >
              <PlayerContent
                text={player?.name}
                color={color}
              />
            </SeatFrame>
          );
        })}
      </SeatGrid>
    </Stack>
  );
};
