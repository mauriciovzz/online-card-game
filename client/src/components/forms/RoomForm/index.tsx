import { Stack } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import { TURN_DURATIONS } from "@/constants";
import {
  Label,
  FormInput,
  FormSegmentedControl,
} from "@/components";
import { FormRuleSelector } from "./FormRuleSelector";

import type { RoomRules } from "@/types";

interface UpdatableInfo {
  name: string;
  turnDuration: "30" | "60" | "90";
  rules: RoomRules;
}

interface Props<T extends UpdatableInfo> {
  form: UseFormReturnType<T>;
  capacityComponent?: React.ReactNode;
  playersComponent?: React.ReactNode;
}

export const RoomForm = <T extends UpdatableInfo>({
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
