import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";

import { useCreateRoom } from "@/hooks/useCreateRoom";
import { ROOM_CAPACITY_OPTIONS } from "@/constants";
import {
  AppButton,
  DeactivatableBox,
  Label,
  FormSegmentedControl,
  RoomForm,
} from "@/components";

import type { CreateRoomProps } from "@/types";
import { useCallback } from "react";

interface Props {
  disabled: boolean;
}

export const CreateRoom = ({ disabled }: Props) => {
  const { t } = useTranslation();

  const form = useForm<CreateRoomProps>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      turnDuration: "30",
      capacity: "2",
      rules: {
        mirror: false,
        stair: false,
        stack: false,
      },
    },

    validate: {
      name: (value) => {
        if (value.length < 1)
          return t("errors.common.empty");
        if (value.length > 15)
          return t("errors.room.maxLength");
        return null;
      },
    },
  });

  const onFormError = useCallback(
    (errorName: string) => {
      const map: Record<string, string> = {
        NAME_EMPTY: "errors.name.empty",
        NAME_MAX_LENGTH: "errors.room.maxLength",
      };

      form.setFieldError("name", t(map[errorName]));
    },
    [form, t]
  );

  const { createRoom } = useCreateRoom({
    onFormError,
  });

  return (
    <DeactivatableBox disabled={disabled}>
      <form
        onSubmit={form.onSubmit(createRoom)}
        style={{
          height: "100%",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <RoomForm
          form={form}
          capacityComponent={
            <Stack gap={0} w="100%">
              <Label
                text={t("room.numPlayers")}
                size="sm"
              />
              <FormSegmentedControl
                data={ROOM_CAPACITY_OPTIONS}
                form={form}
                formKey="capacity"
              />
            </Stack>
          }
        />

        <AppButton
          type="submit"
          text={t("room.create")}
          disabled={!form.values.name}
        />
      </form>
    </DeactivatableBox>
  );
};
