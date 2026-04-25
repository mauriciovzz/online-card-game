import {
  ActionIcon,
  Group,
  Popover,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle } from "@tabler/icons-react";

import { useIsDark, useIsMobile } from "@/hooks";
import { GAME_RULES } from "@/constants";

export const RulesPopover = () => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const isMobile = useIsMobile();
  const isDark = useIsDark();

  const iconColor = isDark
    ? theme.colors.dark[0]
    : theme.black;

  return (
    <Popover position="bottom" withArrow shadow="xs">
      <Popover.Target>
        <ActionIcon
          variant="transparent"
          size="xs"
          color={iconColor}
        >
          <IconInfoCircle size={14} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="sm">
          {GAME_RULES.map(
            ({ key, name, description, icon: Icon }) => (
              <Group key={key} gap={10}>
                <Icon size={30} stroke={1} />
                <Stack gap={0}>
                  <Text size="sm">{t(name)}</Text>

                  <Text size="xs" maw={isMobile ? 215 : ""}>
                    {t(description)}
                  </Text>
                </Stack>
              </Group>
            )
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
