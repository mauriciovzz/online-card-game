import type { PlayerType } from "@shared/types";
import {
  IconMan,
  IconRobot,
  type TablerIcon,
} from "@tabler/icons-react";

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
    key: "ai",
    name: "room.seats.ai",
    description: "room.seats.aiDescription",
    icon: IconRobot,
  },
];
