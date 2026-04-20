import { Stack, Flex } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks/useIsMobile";
import { TURN_DURATIONS } from "@/constants";
import { Label } from "@/components";
import { FormInput } from "./FormInput";
import { FormRuleSelector } from "./FormRuleSelector";
import { FormSegmentedControl } from "./FormSegmentedControl";

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
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Stack flex={1} gap="sm">
      <Stack gap={0}>
        <Label
          text={t("room.name")}
          size="sm"
          error={form.errors.name}
        />
        <FormInput form={form} formKey="name" blurOnEnter />
      </Stack>

      <Flex
        direction={isMobile ? "column" : "row"}
        gap="sm"
      >
        <Stack gap={0} w="100%">
          <Label text={t("room.turnDuration")} size="sm" />
          <FormSegmentedControl
            data={TURN_DURATIONS}
            form={form}
            formKey="turnDuration"
          />
        </Stack>

        {capacityComponent}
      </Flex>

      {playersComponent}

      <FormRuleSelector form={form} />
    </Stack>
  );
};
