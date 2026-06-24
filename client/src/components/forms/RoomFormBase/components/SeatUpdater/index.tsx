import { useMemo, useState } from "react";
import {
  Stack,
  SimpleGrid,
  Box,
  Text,
  Divider,
  Flex,
  Group,
  Loader,
} from "@mantine/core";
import {
  IconX,
  IconMinus,
  IconMan,
  IconRobot,
} from "@tabler/icons-react";
import { t } from "i18next";

import { GAME_COLORS, PLAYER_TYPES } from "@/constants";
import { AppBox, LabelWithPopover } from "@/components";
import { AddSeatCard } from "../AddSeatCard";
import { CornerButton } from "../CornerButton";

import type {
  Player,
  PlayerType,
  Room,
} from "@shared/types";
import { useIsMobile } from "@/hooks";
import { useUpdateSeats } from "./useUpdateSeats";

const SeatCard = ({
  height,
  color,
  type,
  name,
}: {
  height: number;
  color: string;
  type: PlayerType;
  name?: string;
}) => {
  return (
    <AppBox
      h={height}
      p={4}
      bdrs="8px"
      borderColor={color}
      style={{ userSelect: "none" }}
    >
      <Group h="100%" w="100%" gap={4}>
        <Flex
          h="100%"
          w={height - 10}
          justify="center"
          align="center"
        >
          {type === "human" ? (
            <IconMan size={16} color={color} />
          ) : (
            <IconRobot size={16} color={color} />
          )}
        </Flex>

        <Divider orientation="vertical" color={color} />

        <Flex flex={1} align="center" justify="center">
          {name ? (
            <Text
              size="sm"
              fw={700}
              c={color}
              ta="center"
              inline={true}
              truncate="end"
            >
              {name}
            </Text>
          ) : (
            <Loader size="sm" color={color} type="dots" />
          )}
        </Flex>
      </Group>
    </AppBox>
  );
};

interface Props {
  room: Room;
}

export const SeatUpdater = ({ room }: Props) => {
  const isMobile = useIsMobile();
  const height = isMobile ? 42 : 36;

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

      <SimpleGrid spacing="xs" cols={2} mt={5}>
        {room.seats.map((seat) => {
          const { pos, type } = seat;

          const isAvailable = type !== undefined;
          const player = playersByPos[pos];

          const hasPlayer = player?.type === "human";

          const hex = GAME_COLORS[pos - 1].hex;

          if (player?.id === room.adminId) {
            return (
              <SeatCard
                key={hex}
                height={height}
                color={hex}
                type="human"
                name={t("common.you")}
              />
            );
          }

          if (!isAvailable) {
            return (
              <AddSeatCard
                key={hex}
                height={height}
                onSelect={(type: PlayerType) =>
                  openSeat({ pos, type })
                }
              />
            );
          }

          return (
            <Box key={hex} w="100%" pos="relative">
              <SeatCard
                height={height}
                color={hex}
                type={type}
                name={player ? player.name : undefined}
              />

              <CornerButton
                icon={hasPlayer ? IconX : IconMinus}
                onClick={
                  hasPlayer
                    ? () => kickPlayerOut(pos)
                    : () => closeSeat(pos)
                }
              />
            </Box>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};
