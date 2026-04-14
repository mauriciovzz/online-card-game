import { useIsDark } from "@/hooks/useIsDark";
import {
  ActionIcon,
  Group,
  Popover,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconInfoCircle,
  type IconProps,
} from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { GAME_RULES } from "@/constants";

interface Props {
  name: string;
  icon: React.ComponentType<IconProps>;
  info: string;
}

const RuleLabel = ({ name, icon: Icon, info }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Group gap={10}>
      <Icon size={30} stroke={1} />
      <Stack gap={0}>
        <Text size="sm">{name}</Text>

        <Text size="xs" maw={isMobile ? 215 : ""}>
          {info}
        </Text>
      </Stack>
    </Group>
  );
};

export const RulesPopover = () => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const isDark = useIsDark();

  return (
    <Popover position="bottom" withArrow shadow="xs">
      <Popover.Target>
        <ActionIcon
          variant="transparent"
          size="xs"
          color={
            isDark ? theme.colors.dark[0] : theme.black
          }
        >
          <IconInfoCircle size={14} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="sm">
          {GAME_RULES.map(({ name, icon, info }) => (
            <RuleLabel
              key={name}
              name={t(name)}
              icon={icon}
              info={t(info)}
            />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
