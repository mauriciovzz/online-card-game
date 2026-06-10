import {
  ActionIcon,
  Divider,
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

import { useIsDark } from "@/hooks";
import type { ComponentType } from "react";
import { Label } from "./Label";

interface Props {
  label: string;
  description?: {
    title: string;
    text: string;
  };
  data: {
    key: string;
    name: string;
    description: string;
    icon: ComponentType<IconProps>;
  }[];
}

export const LabelWithPopover = ({
  label,
  description,
  data,
}: Props) => {
  const { t } = useTranslation();

  const theme = useMantineTheme();
  const isDark = useIsDark();

  return (
    <Group gap={3}>
      <Label size="sm" text={label} />
      <Popover
        position="bottom"
        shadow="xs"
        withArrow
        withOverlay
        zIndex={10001}
      >
        <Popover.Target>
          <ActionIcon
            variant="transparent"
            size="xs"
            color={
              isDark ? theme.colors.dark[0] : theme.black
            }
          >
            <IconInfoCircle size={16} />
          </ActionIcon>
        </Popover.Target>

        <Popover.Dropdown p="sm">
          <Stack
            gap="sm"
            w={340}
            style={{ userSelect: "none" }}
          >
            {description && (
              <>
                <Stack gap={0}>
                  <Text fw={700}>
                    {t(description.title)}
                  </Text>
                  <Text size="sm" ta="justify">
                    {t(description.text)}
                  </Text>
                </Stack>

                <Divider />
              </>
            )}

            {data.map(
              ({ key, name, description, icon: Icon }) => (
                <Group key={key} gap={10}>
                  <Icon size={30} stroke={1} />
                  <Stack gap={2}>
                    <Text size="sm" fw={700} inline={true}>
                      {t(name)}
                    </Text>
                    <Text size="sm" inline={true}>
                      {t(description)}
                    </Text>
                  </Stack>
                </Group>
              )
            )}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
};
