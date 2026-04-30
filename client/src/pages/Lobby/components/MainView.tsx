import { Group, Title } from "@mantine/core";

import { useThemeColor } from "@/hooks";
import {
  SelectedRules,
  InfoBox,
  AppBox,
  RoomPlayers,
} from "@/components";

import type { Room } from "@shared/types";

interface Props {
  room: Room;
}

export const MainView = ({ room }: Props) => {
  const themeColor = useThemeColor();

  return (
    <>
      <Title w="100%">{room.name}</Title>

      <Group gap="sm">
        <InfoBox
          text="room.turnDuration"
          info={room.turnDuration + "s"}
        />

        <InfoBox
          text={"rules.title"}
          info={<SelectedRules rules={room.rules} />}
        />
      </Group>

      <AppBox borderColor={themeColor}>
        <RoomPlayers room={room} />
      </AppBox>
    </>
  );
};
