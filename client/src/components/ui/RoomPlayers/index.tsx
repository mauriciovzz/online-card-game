import { useMemo } from "react";
import {
  Text,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";
import { IconUserFilled, IconX } from "@tabler/icons-react";

import { GAME_COLORS } from "@/constants";
import { useThemeColor } from "@/hooks";
import { SlotBase } from "./SlotBase";

import type { Player, Room } from "@shared/types";
import { useSocket } from "@/contexts/SocketContext";

interface Props {
  room: Room;
  isEditable?: boolean;
  onKick?: (playerId: string) => void;
}

export const RoomPlayers = ({
  room,
  isEditable,
  onKick,
}: Props) => {
  const { socket } = useSocket();
  const themeColor = useThemeColor();

  const playersByPos = useMemo(() => {
    const map: Partial<Record<number, Player>> = {};

    room.players.forEach((p) => {
      map[p.pos] = p;
    });

    return map;
  }, [room.players]);

  const capacity = Number(room.capacity);

  return (
    <SimpleGrid
      w={isEditable ? "100%" : 212}
      spacing="xs"
      cols={2}
    >
      {GAME_COLORS.map((key) => {
        const isAvailable = key.pos <= capacity;

        const player = playersByPos[key.pos];
        const isAdmin = player?.id === room.adminId;
        const isClient = player?.id === socket?.id;

        let color = themeColor;
        if (isAvailable) color = key.hex;

        const handleKick =
          onKick && player
            ? () => onKick(player.id)
            : undefined;

        return (
          <SlotBase
            key={key.hex}
            isAvailable={isAvailable}
            hasPlayer={player ? true : false}
            color={color}
            size={isEditable ? undefined : 100}
          >
            <Text
              size="sm"
              fw={700}
              c={color}
              ta="center"
              inline={true}
              truncate="end"
            >
              {player?.name}
            </Text>

            {isClient && !isEditable && (
              <IconUserFilled
                color={color}
                size={13}
                style={{
                  position: "absolute",
                  transform: "translateY(-24px)",
                }}
              />
            )}

            {isEditable && player && !isAdmin && (
              <ActionIcon
                variant="default"
                pos="absolute"
                size="xs"
                bdrs="sm"
                top={-9}
                right={-9}
                onClick={handleKick}
              >
                <IconX size={12} />
              </ActionIcon>
            )}
          </SlotBase>
        );
      })}
    </SimpleGrid>
  );
};
