import { useMemo, type ReactNode } from "react";
import { Text, Loader, Flex } from "@mantine/core";

import { GAME_COLORS } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";

import type { Room } from "@shared/types";
import { SeatBox } from "@/components";

type BoardPosition = "top" | "bottom" | "left" | "right";

const layout: BoardPosition[] = [
  "bottom",
  "left",
  "top",
  "right",
];

const getBoardPosition = (
  clientPos: number,
  seatPos: number
): BoardPosition => {
  return layout[(seatPos - clientPos + 4) % 4];
};

const SeatCard = ({
  children,
  ...props
}: {
  borderColor: string;
  pos: BoardPosition;
  children?: ReactNode;
}) => {
  return <SeatBox {...props}>{children}</SeatBox>;
};

const BOARD_PADDING = 12 + 12 + 26;

interface Props {
  room: Room;
  children: ReactNode;
}

export const LobbySeats = ({ room, children }: Props) => {
  const { socket } = useSocket();

  const client = useMemo(
    () =>
      room.players.find(
        (player) => player.id === socket?.id
      ),
    [room.players, socket?.id]
  );

  const playerByPos = useMemo(
    () =>
      Object.fromEntries(
        room.seats.map((s) => {
          const player = room.players.find(
            (p) => p.pos === s.pos
          );

          return [s.pos, player];
        })
      ),
    [room.players, room.seats]
  );

  if (!client) return null;

  return (
    <>
      {room.seats.map((seat) => {
        const pos = getBoardPosition(client.pos, seat.pos);
        const hex = GAME_COLORS[seat.pos - 1].hex;

        if (seat.type === undefined) {
          return <SeatBox key={hex} pos={pos} />;
        }

        const player = playerByPos[seat.pos];

        return (
          <SeatCard key={hex} borderColor={hex} pos={pos}>
            {player ? (
              <Text
                size="sm"
                fw={700}
                c={hex}
                ta="center"
                inline={true}
              >
                {player.name}
              </Text>
            ) : (
              <Loader type="dots" size="sm" color={hex} />
            )}
          </SeatCard>
        );
      })}

      <Flex
        h="100%"
        w="100%"
        p={BOARD_PADDING}
        gap={0}
        pos="relative"
      >
        {children}
      </Flex>
    </>
  );
};
