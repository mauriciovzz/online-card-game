import { Stack, Text } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslation } from "react-i18next";

import { TURN_DURATIONS } from "@/constants";
import { Label, FormInput } from "@/components";
import { FormRuleSelector } from "./components/FormRuleSelector";
import { FormSegmentedControl } from "./components/FormSegmentedControl";
import { FormSeatSelector } from "./components/Seats/FormSeatSelector";

import type { CreateRoomProps, Room, RoomInfo } from "@shared/types";
import type { ReactNode } from "react";
import { SeatUpdater } from "./components/Seats/SeatUpdater";

type RoomFormValues = CreateRoomProps | RoomInfo;

interface Props<T extends RoomFormValues> {
  form: UseFormReturnType<T>;
  onSubmit: (newData: T) => void;
  showSeats?: boolean;
  room?: Room;
  submitButtom: ReactNode;
}

export const RoomFormBase = <T extends RoomFormValues>({
  form,
  onSubmit,
  showSeats,
  room,
  submitButtom,
}: Props<T>) => {
  const { t } = useTranslation();

  return (
    <Stack w="100%" h="100%" p="sm" gap="sm">
      <form
        onSubmit={form.onSubmit(onSubmit)}
        style={{
          height: "100%",
          width: "100%",
          gap: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack gap="sm" flex={1}>
          <Text fw={700} size="lg" inline={true}>
            {t(showSeats ? "room.create" : "room.update")}
          </Text>

          <Stack gap={0}>
            <Label size="sm" text={"room.name"} error={form.errors.name} />
            <FormInput form={form} formKey="name" blurOnEnter />
          </Stack>

          <FormSegmentedControl
            label={"room.turnDuration"}
            data={TURN_DURATIONS}
            form={form}
            formKey="turnDuration"
          />

          <FormRuleSelector form={form} />

          {showSeats && "seats" in form.values && (
            <FormSeatSelector
              form={form as UseFormReturnType<CreateRoomProps>}
            />
          )}

          {room && <SeatUpdater room={room} />}
        </Stack>

        {submitButtom}
      </form>
    </Stack>
  );
};
