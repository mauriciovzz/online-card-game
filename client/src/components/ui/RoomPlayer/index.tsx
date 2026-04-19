import { useMemo } from "react";
import {
  Text,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import { useThemeColor } from "@/hooks/useThemeColor";
import { PLAYER_SLOTS } from "@/constants";
import { SlotBase } from "./SlotBase";

import type { PlayerSlot, Room } from "@/types";

const SlotText = ({
  color,
  size,
  isBig,
  text,
}: {
  color: string;
  size: number;
  isBig?: boolean;
  text?: string;
}) => {
  const textSize = 20.3;
  const top =
    (size - textSize) / 2 + (isBig ? 0 : textSize);

  return (
    <Text
      w={90}
      size={isBig ? "sm" : "xs"}
      fw={isBig ? 700 : 500}
      c={color}
      ta="center"
      pos="absolute"
      style={{ top }}
    >
      {text}
    </Text>
  );
};

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
  const themeColor = useThemeColor();

  const playersByPos = useMemo(() => {
    const map: Partial<Record<number, PlayerSlot>> = {};
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
      {PLAYER_SLOTS.map((key) => {
        const isAvailable = key.pos <= capacity;

        const player = playersByPos[key.pos];
        const isAdmin = player?.id === room.adminId;

        let color = themeColor;
        if (isAvailable) color = key.css;

        const handleKick = onKick
          ? () => {
              if (player) {
                onKick(player.id);
              }
            }
          : undefined;

        return (
          <SlotBase
            key={key.pos}
            isAvailable={isAvailable}
            hasPlayer={player ? true : false}
            color={color}
            size={isEditable ? undefined : 100}
          >
            {isEditable ? (
              <>
                <Text
                  size="sm"
                  fw={700}
                  c={color}
                  ta="center"
                >
                  {player?.name}
                </Text>

                {player && !isAdmin && (
                  <ActionIcon
                    variant="default"
                    pos="absolute"
                    size="xs"
                    top={-9}
                    right={-9}
                    onClick={handleKick}
                  >
                    <IconX />
                  </ActionIcon>
                )}
              </>
            ) : (
              <>
                <SlotText
                  color={color}
                  size={100}
                  isBig
                  text={player?.name}
                />

                {isAdmin && (
                  <SlotText
                    color={color}
                    size={100}
                    text="admin"
                  />
                )}
              </>
            )}
          </SlotBase>
        );
      })}
    </SimpleGrid>
  );
};
