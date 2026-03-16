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
  IconFlipVertical,
  IconStairs,
  IconStack2,
  IconInfoCircle,
  type IconProps,
} from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  name: string;
  icon: React.ComponentType<IconProps>;
  text: string;
}

const RuleLabel = ({ name, icon: Icon, text }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Group gap={10}>
      <Icon size={30} stroke={1} />
      <Stack gap={0}>
        <Text size="sm">{name}</Text>

        <Text size="xs" maw={isMobile ? 215 : ""}>
          {text}
        </Text>
      </Stack>
    </Group>
  );
};

const rules: Props[] = [
  {
    name: "mirror",
    icon: IconFlipVertical,
    text: "mirrorInfo",
  },
  {
    name: "stair",
    icon: IconStairs,
    text: "stairInfo",
  },
  {
    name: "stack",
    icon: IconStack2,
    text: "stackInfo",
  },
];

export const RulesPopover = () => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const isDark = useIsDark();

  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon
          variant="transparent"
          color={
            isDark ? theme.colors.dark[0] : theme.black
          }
        >
          <IconInfoCircle size={15} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap={10}>
          {rules.map(({ name, icon, text }) => (
            <RuleLabel
              key={name}
              name={t(name)}
              icon={icon}
              text={t(text)}
            />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
