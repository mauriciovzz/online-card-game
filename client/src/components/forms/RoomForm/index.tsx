import { Stack } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import { TURN_DURATIONS } from "@/constants";
import {
  Label,
  FormInput,
  FormSegmentedControl,
} from "@/components";
import { FormRuleSelector } from "./FormRuleSelector";

import type { RoomInfo } from "@shared/types";

interface Props<T extends RoomInfo> {
  form: UseFormReturnType<T>;
  capacityComponent?: React.ReactNode;
  playersComponent?: React.ReactNode;
}

export const RoomForm = <T extends RoomInfo>({
  form,
  capacityComponent,
  playersComponent,
}: Props<T>) => {
  return (
    <Stack flex={1} gap="sm">
      <Stack gap={0}>
        <Label
          size="sm"
          text={"room.name"}
          error={form.errors.name}
        />
        <FormInput form={form} formKey="name" blurOnEnter />
      </Stack>

      <FormSegmentedControl
        label={"room.turnDuration"}
        data={TURN_DURATIONS}
        form={form}
        formKey="turnDuration"
      />

      {capacityComponent}

      {playersComponent}

      <FormRuleSelector form={form} />
    </Stack>
  );
};
