import {
  IconFlipVertical,
  IconStack2,
  IconStairs,
  type IconProps,
} from "@tabler/icons-react";

import type { RoomRules } from "@/types";

export const GAME_RULES: {
  key: keyof RoomRules;
  name: string;
  description: string;
  icon: React.ComponentType<IconProps>;
  borderRadius: string;
}[] = [
  {
    key: "mirror",
    name: "rules.mirror.title",
    description: "rules.mirror.description",
    icon: IconFlipVertical,
    borderRadius: "4px 0 0 4px",
  },
  {
    key: "stair",
    name: "rules.stair.title",
    description: "rules.stair.description",
    icon: IconStairs,
    borderRadius: "0 0 0 0",
  },
  {
    key: "stack",
    name: "rules.stack.title",
    description: "rules.stack.description",
    icon: IconStack2,
    borderRadius: "0 4px 4px 0",
  },
];
