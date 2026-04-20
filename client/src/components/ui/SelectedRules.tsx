import { Flex, Divider } from "@mantine/core";

import { useThemeColor } from "@/hooks/useThemeColor";
import { GAME_RULES } from "@/constants";

import type { RoomRules } from "@/types";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";
import React from "react";

interface Props {
  rules: RoomRules;
  isSmall?: boolean;
}

export const SelectedRules = ({
  rules,
  isSmall,
}: Props) => {
  const themeColor = useThemeColor();

  const renderIcon = (
    name: keyof RoomRules,
    Icon: ComponentType<IconProps>
  ) => (
    <Icon
      key={name}
      size={isSmall ? 19 : 20}
      stroke={1.5}
      color={rules[name] ? undefined : themeColor}
    />
  );

  return (
    <Flex
      w={isSmall ? 65 : "100%"}
      gap={isSmall ? 4 : 0}
      align={isSmall ? "start" : "center"}
      justify={isSmall ? "start" : "space-evenly"}
    >
      {GAME_RULES.map(({ key, icon: Icon }, i) => (
        <React.Fragment key={key}>
          {renderIcon(key, Icon)}
          {!isSmall && i < 2 && (
            <Divider orientation="vertical" />
          )}
        </React.Fragment>
      ))}
    </Flex>
  );
};
