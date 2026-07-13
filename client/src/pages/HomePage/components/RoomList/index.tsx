import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Badge,
  Divider,
  Flex,
  Group,
  UnstyledButton,
  Text,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { useSocket } from "@/contexts/SocketContext";
import { GAME_COLORS } from "@/constants";
import { SelectedRules } from "@/components";
import { useThemeColor, useIsDark } from "@/hooks";
import { useJoinRoom } from "./useJoinRoom";

import type { Room } from "@shared/types";

const RoomButton = ({
  room,
  onClick,
}: {
  room: Room;
  onClick: () => void;
}) => {
  const { hovered, ref } = useHover();

  const themeColor = useThemeColor();
  const isDark = useIsDark();

  return (
    <UnstyledButton
      ref={ref}
      w="100%"
      h={54}
      px={12}
      style={(theme) => {
        const normalBg = isDark
          ? theme.colors.dark[6]
          : "white";

        const hoverBg = isDark
          ? theme.colors.dark[5]
          : theme.colors.gray[0];

        return {
          borderBottom: `1px solid ${themeColor}`,
          backgroundColor: hovered ? hoverBg : normalBg,
        };
      }}
      onClick={onClick}
    >
      <Group w="100%" gap={10}>
        <Text flex={1} size="sm" truncate="end">
          {room.name}
        </Text>

        <Divider orientation="vertical" />

        <SelectedRules rules={room.rules} isSmall />

        <Divider orientation="vertical" />

        <Flex w={84} h={20} wrap="wrap" gap={4}>
          {room.seats.map((seat) => {
            const player = room.players.find(
              (p) => p.pos === seat.pos
            );

            const enabled = seat.type !== undefined;

            const color = enabled
              ? GAME_COLORS[seat.pos - 1].hex
              : themeColor;

            const variant = enabled
              ? player
                ? "filled"
                : "outline"
              : "filled";

            return (
              <Badge
                variant={variant}
                color={color}
                size="sm"
                radius="sm"
              />
            );
          })}
        </Flex>
      </Group>
    </UnstyledButton>
  );
};

export const RoomList = () => {
  const { t } = useTranslation();

  const { rooms, fetchRooms } = useSocket();
  const { joinRoom } = useJoinRoom();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return rooms.length === 0 ? (
    <Flex
      w="100%"
      h="100%"
      align="center"
      justify="center"
      fw={700}
    >
      {t("room.empty")}
    </Flex>
  ) : (
    <ScrollArea w="100%" h="100%">
      <Stack w="100%" h="100%" gap={0}>
        {rooms.map((room) => (
          <RoomButton
            key={room.id}
            room={room}
            onClick={() => joinRoom(room.id)}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};
