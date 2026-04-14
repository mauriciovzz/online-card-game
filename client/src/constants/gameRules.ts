import {
  IconFlipVertical,
  IconStack2,
  IconStairs,
  type IconProps,
} from "@tabler/icons-react";

import type { RoomRules } from "@/types";

export const GAME_RULES: {
  name: keyof RoomRules;
  borderRadius: string;
  icon: React.ComponentType<IconProps>;
  info: string;
}[] = [
  {
    name: "mirror",
    borderRadius: "4px 0 0 4px",
    icon: IconFlipVertical,
    info: "mirrorInfo",
  },
  {
    name: "stair",
    borderRadius: "0 0 0 0",
    icon: IconStairs,
    info: "stairInfo",
  },
  {
    name: "stack",
    borderRadius: "0 4px 4px 0",
    icon: IconStack2,
    info: "stackInfo",
  },
];
