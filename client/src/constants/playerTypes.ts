import type { PlayerType } from "@shared/types";
import { IconMan, IconRobot, type TablerIcon } from "@tabler/icons-react";

export const PLAYER_TYPES: {
  key: PlayerType;
  name: string;
  description: string;
  icon: TablerIcon;
}[] = [
  {
    key: "human",
    name: "room.seats.human",
    description: "room.seats.humanDescription",
    icon: IconMan,
  },
  {
    key: "bot",
    name: "room.seats.bot",
    description: "room.seats.botDescription",
    icon: IconRobot,
  },
];
