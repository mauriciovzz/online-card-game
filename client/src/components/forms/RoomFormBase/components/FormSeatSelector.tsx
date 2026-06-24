import {
  Stack,
  SimpleGrid,
  Flex,
  SegmentedControl,
  Tooltip,
  Center,
  Text,
} from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { GAME_COLORS, PLAYER_TYPES } from "@/constants";
import { useIsMobile, useIsDark } from "@/hooks";
import { LabelWithPopover } from "@/components";

import type { UseFormReturnType } from "@mantine/form";
import type {
  CreateRoomProps,
  PlayerType,
} from "@shared/types";
import { AddSeatCard } from "./AddSeatCard";
import { CornerButton } from "./CornerButton";

interface Props {
  form: UseFormReturnType<CreateRoomProps>;
}

export const FormSeatSelector = ({ form }: Props) => {
  const { t } = useTranslation();

  const isDark = useIsDark();

  const isMobile = useIsMobile();
  const height = isMobile ? 42 : 36;
  const innerHeight = height - 10;

  return (
    <Stack gap={0}>
      <LabelWithPopover
        text="room.seats.title"
        description={{
          title: "room.seats.selectionTitle",
          text: "room.seats.selectionDescription",
        }}
        data={PLAYER_TYPES}
        error={form.errors.seats}
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

        {form.values.seats.map((seat) => {
          const seatIndex = seat.pos - 2;
          const seatPath = `seats.${seatIndex.toString()}.type`;

          const hex = GAME_COLORS[seatIndex + 1].hex;

          if (seat.type) {
            return (
              <Flex key={hex} h={height} pos="relative">
                <SegmentedControl
                  w="100%"
                  bd={`1px solid ${hex}`}
                  color={hex}
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
                  data={PLAYER_TYPES.map(
                    ({ key, name, icon: Icon }) => ({
                      value: key,
                      label: (
                        <Tooltip label={t(name)}>
                          <Center w="100%" h="100%">
                            <Icon size={18} />
                          </Center>
                        </Tooltip>
                      ),
                    })
                  )}
                  key={form.key(seatPath)}
                  {...form.getInputProps(seatPath)}
                />

                <CornerButton
                  icon={IconMinus}
                  onClick={() =>
                    form.setFieldValue(seatPath, undefined)
                  }
                />
              </Flex>
            );
          }

          return (
            <AddSeatCard
              key={hex}
              height={height}
              simple
              onSelect={(type: PlayerType) =>
                form.setFieldValue(seatPath, type)
              }
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
};
