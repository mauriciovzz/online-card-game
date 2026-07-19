import { Stack, SegmentedControl, Center } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslation } from "react-i18next";

import { GAME_COLORS, PLAYER_TYPES } from "@/constants";
import { SEAT_HEIGHT } from "./constants/seatSize";
import { LabelWithPopover } from "@/components";
import { SeatCreator, SeatGrid, PlayerContent, SeatFrame } from "./components";

import type { CreateRoomProps, PlayerType } from "@shared/types";

const SeatSegmentedControl = ({
  color,
  form,
  path,
}: {
  color: string;
  form: UseFormReturnType<CreateRoomProps>;
  path: string;
}) => {
  return (
    <SegmentedControl
      flex={1}
      size="xs"
      p={0}
      bdrs="sm"
      color={color}
      autoContrast
      transitionDuration={0}
      styles={{
        root: { SEAT_HEIGHT },
        control: { height: SEAT_HEIGHT - 10 },
        label: { height: SEAT_HEIGHT - 10, padding: 0 },
      }}
      data={PLAYER_TYPES.map(({ key, icon: Icon }) => ({
        value: key,
        label: (
          <Center w="100%" h="100%">
            <Icon size={18} />
          </Center>
        ),
      }))}
      key={form.key(path)}
      {...form.getInputProps(path)}
    />
  );
};

interface Props {
  form: UseFormReturnType<CreateRoomProps>;
}

export const FormSeatSelector = ({ form }: Props) => {
  const { t } = useTranslation();

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

      <SeatGrid>
        <SeatFrame pos={1} color={GAME_COLORS[0].hex}>
          <PlayerContent text={t("common.you")} color={GAME_COLORS[0].hex} />
        </SeatFrame>

        {form.values.seats.map(({ pos, type }) => {
          const color = GAME_COLORS[pos - 1].hex;
          const path = `seats.${(pos - 2).toString()}.type`;

          if (type) {
            return (
              <SeatFrame
                key={color}
                pos={pos}
                color={color}
                action={{
                  onClick: () => {
                    form.setFieldValue(path, undefined);
                  },
                }}
              >
                <SeatSegmentedControl color={color} form={form} path={path} />
              </SeatFrame>
            );
          }

          return (
            <SeatCreator
              key={color}
              pos={pos}
              color={color}
              autoHuman
              onSelect={(type: PlayerType) => {
                form.setFieldValue(path, type);
              }}
            />
          );
        })}
      </SeatGrid>
    </Stack>
  );
};
