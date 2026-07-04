import {
  IconFlipVertical,
  IconStack2,
  IconStairs,
  type IconProps,
} from "@tabler/icons-react";

import type { RoomRules } from "@shared/types";

export const GAME_RULES: {
  key: keyof RoomRules;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<IconProps>;
  borderRadius: string;
}[] = [
  {
    key: "mirror",
    name: "rules.mirror.title",
    description: "rules.mirror.description",
    longDescription: "rules.mirror.longDescription",
    icon: IconFlipVertical,
    borderRadius: "4px 0 0 4px",
  },
  {
    key: "stair",
    name: "rules.stair.title",
    description: "rules.stair.description",
    longDescription: "rules.stair.longDescription",
    icon: IconStairs,
    borderRadius: "0 0 0 0",
  },
  {
    key: "stack",
    name: "rules.stack.title",
    description: "rules.stack.description",
    longDescription: "rules.stack.longDescription",
    icon: IconStack2,
    borderRadius: "0 4px 4px 0",
  },
];
