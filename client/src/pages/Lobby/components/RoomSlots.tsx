import { Group, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useThemeColor } from "@/hooks/useThemeColor";
import {
  SelectedRules,
  InfoBox,
  AppBox,
  RoomPlayers,
} from "@/components";

import type { Room } from "@/types";

interface Props {
  room: Room;
}

export const RoomSlots = ({ room }: Props) => {
  const { t } = useTranslation();

  const themeColor = useThemeColor();

  return (
    <>
      <Title w="100%">{room.name}</Title>

      <Group gap="sm">
        <InfoBox
          text={t("room.turnDuration")}
          info={`${room.turnDuration}s`}
        />

        <InfoBox
          text={t("rules.title")}
          info={<SelectedRules rules={room.rules} />}
        />
      </Group>

      <AppBox borderColor={themeColor}>
        <RoomPlayers room={room} />
      </AppBox>
    </>
  );
};
