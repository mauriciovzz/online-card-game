import { Group, useMantineTheme } from "@mantine/core";
import {
  IconFlipVertical,
  IconStairs,
  IconStack2,
  type IconProps,
} from "@tabler/icons-react";

import { useIsDark } from "@/hooks/useIsDark";

import type { RoomRules } from "@/types";

const ruleIcons: {
  icon: React.ComponentType<IconProps>;
  key: keyof RoomRules;
}[] = [
  { icon: IconFlipVertical, key: "mirror" },
  { icon: IconStairs, key: "stair" },
  { icon: IconStack2, key: "stack" },
];

interface RulesIconsProps {
  rules: RoomRules;
}

export const RulesIcons = ({ rules }: RulesIconsProps) => {
  const isDark = useIsDark();
  const theme = useMantineTheme();

  return (
    <Group w={65} gap={4}>
      {ruleIcons.map(({ icon: Icon, key }) => (
        <Icon
          key={key}
          size={19}
          stroke={1.5}
          color={
            rules[key]
              ? undefined
              : isDark
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
          }
        />
      ))}
    </Group>
  );
};
