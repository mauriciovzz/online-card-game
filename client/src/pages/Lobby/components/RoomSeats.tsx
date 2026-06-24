import { useMemo } from "react";
import { Text, SimpleGrid, Loader } from "@mantine/core";
import { IconCancel } from "@tabler/icons-react";

import { GAME_COLORS } from "@/constants";
import { useThemeColor } from "@/hooks";
import { AppBox } from "@/components";

import type { Player, Room } from "@shared/types";

interface Props {
  room: Room;
}

export const RoomSeats = ({ room }: Props) => {
  const themeColor = useThemeColor();

  const playersByPos = useMemo(() => {
    const map: Partial<Record<number, Player>> = {};

    room.players.forEach((p) => {
      map[p.pos] = p;
    });

    return map;
  }, [room.players]);

  return (
    <SimpleGrid w={212} spacing="xs" cols={2}>
      {room.seats.map((seat) => {
        const isAvailable = seat.type !== undefined;

        const player = playersByPos[seat.pos];

        let color = themeColor;
        const hex = GAME_COLORS[seat.pos - 1].hex;

        if (isAvailable) color = hex;

        return (
          <AppBox
            key={hex}
            borderColor={color}
            w={100}
            h={100}
            style={{ userSelect: "none" }}
            p="sm"
          >
            {!isAvailable ? (
              <IconCancel color={color} />
            ) : player ? (
              <Text
                size="sm"
                fw={700}
                c={color}
                ta="center"
                inline={true}
                truncate="end"
              >
                {player.name}
              </Text>
            ) : (
              <Loader size="sm" color={color} type="dots" />
            )}
          </AppBox>
        );
      })}
    </SimpleGrid>
  );
};
