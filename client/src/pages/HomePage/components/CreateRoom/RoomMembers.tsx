import {
  Stack,
  SimpleGrid,
  Flex,
  SegmentedControl,
  Tooltip,
  Center,
  ActionIcon,
  Text,
} from "@mantine/core";
import {
  IconMan,
  IconRobot,
  IconX,
  IconPlus,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { GAME_COLORS } from "@/constants";
import {
  useThemeColor,
  useIsMobile,
  useIsDark,
} from "@/hooks";
import { LabelWithPopover } from "@/components";

import type { UseFormReturnType } from "@mantine/form";
import type { CreateRoomProps } from "@shared/types";

const PLAYER_TYPES = [
  {
    key: "human",
    name: "room.members.human",
    description: "room.members.humanDescription",
    icon: IconMan,
  },
  {
    key: "ai",
    name: "room.members.ai",
    description: "room.members.aiDescription",
    icon: IconRobot,
  },
];

interface Props {
  form: UseFormReturnType<CreateRoomProps>;
}

export const RoomMembers = ({ form }: Props) => {
  const { t } = useTranslation();

  const themeColor = useThemeColor();
  const isDark = useIsDark();

  const isMobile = useIsMobile();
  const height = isMobile ? 42 : 36;
  const innerHeight = height - 10;

  const firstAvailablePos = form.values.players.find(
    (player) => player.type === undefined
  )?.pos;

  const removablePos = [...form.values.players]
    .reverse()
    .find((player) => player.pos !== 2 && player.type)?.pos;

  return (
    <Stack gap={0}>
      <LabelWithPopover
        label="room.members.title"
        description={{
          title: "room.members.descriptionTitle",
          text: "room.members.description",
        }}
        data={PLAYER_TYPES}
      />

      <SimpleGrid cols={4} spacing={10}>
        <Flex
          h={height}
          p={4}
          bd={`1px solid ${GAME_COLORS[0].hex}`}
          bdrs="md"
          bg={isDark ? "#1f1f1f" : "#f1f3f5"}
        >
          <Flex
            flex={1}
            bg={GAME_COLORS[0].hex}
            bdrs="sm"
            align="center"
            justify="center"
          >
            <Text
              size="sm"
              inline={true}
              fw={700}
              c="white"
            >
              {t("common.you")}
            </Text>
          </Flex>
        </Flex>

        {form.values.players.map((slot) => {
          const playerIndex = slot.pos - 2;
          const playerPath =
            `players.${playerIndex.toString()}.type` as const;

          const color = GAME_COLORS[playerIndex + 1].hex;

          if (slot.type) {
            return (
              <Flex
                key={slot.pos}
                h={height}
                pos="relative"
              >
                <SegmentedControl
                  w="100%"
                  bd={`1px solid ${color}`}
                  color={color}
                  styles={{
                    root: { height },
                    control: {
                      height: innerHeight,
                    },
                    label: {
                      height: innerHeight,
                      padding: 0,
                    },
                  }}
                  data={[
                    {
                      value: "human",
                      label: (
                        <Tooltip
                          label={t("room.members.human")}
                        >
                          <Center w="100%" h="100%">
                            <IconMan size={18} />
                          </Center>
                        </Tooltip>
                      ),
                    },
                    {
                      value: "ai",
                      label: (
                        <Tooltip
                          label={t("room.members.ai")}
                        >
                          <Center w="100%" h="100%">
                            <IconRobot size={20} />
                          </Center>
                        </Tooltip>
                      ),
                    },
                  ]}
                  key={form.key(playerPath)}
                  {...form.getInputProps(playerPath)}
                />

                {slot.pos === removablePos && (
                  <ActionIcon
                    variant="default"
                    size="xs"
                    pos="absolute"
                    top={-8}
                    right={-8}
                    style={{ zIndex: 10 }}
                    onClick={() =>
                      form.setFieldValue(
                        playerPath,
                        undefined
                      )
                    }
                  >
                    <IconX size={12} />
                  </ActionIcon>
                )}
              </Flex>
            );
          }

          if (slot.pos === firstAvailablePos) {
            return (
              <Flex
                key={slot.pos}
                w="100%"
                bd={`1px solid ${themeColor}`}
                bdrs="md"
                align="center"
                justify="center"
              >
                <ActionIcon
                  variant="subtle"
                  onClick={() =>
                    form.setFieldValue(playerPath, "human")
                  }
                >
                  <IconPlus size={20} />
                </ActionIcon>
              </Flex>
            );
          }

          return (
            <Flex
              key={slot.pos}
              w="100%"
              bd={`1px solid ${themeColor}`}
              bdrs="md"
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};
