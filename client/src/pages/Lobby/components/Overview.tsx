import { Group } from "@mantine/core";

import {
  SelectedRules,
  InfoBox,
  AppBox,
  RoomPlayers,
  AppTitle,
} from "@/components";

import type { Room } from "@shared/types";

interface Props {
  room: Room;
}

export const Overview = ({ room }: Props) => (
  <>
    <AppTitle text={room.name} />

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

    <AppBox>
      <RoomPlayers room={room} />
    </AppBox>
  </>
);
