import { useMemo } from "react";
import {
  Group,
  Loader,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCancel } from "@tabler/icons-react";

import { useThemeColor } from "@/hooks/useThemeColor";
import { PLAYER_COLORS } from "@/constants";
import {
  SelectedRules,
  InfoBox,
  AppBox,
} from "@/components";

import type { PlayerSlot, Room } from "@/types";

const SlotText = ({
  color,
  isBig,
  text,
}: {
  color: string;
  isBig?: boolean;
  text: string;
}) => (
  <Text
    w={90}
    size={isBig ? "sm" : "xs"}
    fw={isBig ? 700 : 500}
    c={color}
    ta="center"
    pos="absolute"
    style={{ top: isBig ? 39.85 : 60.15 }}
  >
    {text}
  </Text>
);

const Slot = ({
  isSlotAvailable,
  player,
  color,
  adminId,
}: {
  isSlotAvailable: boolean;
  player: PlayerSlot | undefined;
  color: string;
  adminId: string;
}) => (
  <AppBox
    borderColor={color}
    w={100}
    h={100}
    p={5}
    pos="relative"
    style={{ userSelect: "none" }}
  >
    {isSlotAvailable ? (
      player ? (
        <>
          <SlotText
            color={color}
            isBig
            text={player.name}
          />
          {adminId === player.id && (
            <SlotText color={color} text="admin" />
          )}
        </>
      ) : (
        <Loader size="sm" color={color} type="dots" />
      )
    ) : (
      <IconCancel color={color} />
    )}
  </AppBox>
);

interface Props {
  room: Room;
}

export const RoomSlots = ({ room }: Props) => {
  const { t } = useTranslation();
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
    <>
      <Group gap="sm">
        <InfoBox
          text={t("turnDuration")}
          info={`${room.turnDuration}s`}
        />

        <InfoBox
          text={t("rules")}
          info={<SelectedRules rules={room.rules} />}
        />
      </Group>

      <AppBox borderColor={themeColor}>
        <SimpleGrid cols={2} spacing="sm" w={212}>
          {[1, 2, 3, 4].map((key) => {
            const isSlotAvailable = key <= capacity;

            let color = themeColor;

            if (isSlotAvailable) {
              color = PLAYER_COLORS[key - 1].string;
            }

            return (
              <Slot
                key={key}
                isSlotAvailable={isSlotAvailable}
                player={playersByPos[key]}
                color={color}
                adminId={room.adminId}
              />
            );
          })}
        </SimpleGrid>
      </AppBox>
    </>
  );
};
