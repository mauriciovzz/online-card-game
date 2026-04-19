import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

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

interface Props {
  disabled: boolean;
}

export const CreateRoom = ({ disabled }: Props) => {
  const navigate = useNavigate();
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
        if (value.length < 1) return t("EMPTY");
        if (value.length > 15) return t("ROOM_MAX_LENGTH");
        return null;
      },
    },
  });

  const onFormSuccess = (roomId: string) => {
    void navigate(`/room/${roomId}/lobby`);
  };

  const onFormError = (errorName: string) => {
    form.setFieldError("name", t(errorName));
  };

  const { handleSubmit } = useCreateRoom(
    onFormSuccess,
    onFormError
  );

  return (
    <DeactivatableBox
      disabledText={t("finishUpdatingName")}
      disabled={disabled}
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
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
              <Label text={t("numberPlayers")} size="sm" />
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
          text={t("createRoom")}
          disabled={!form.values.name}
        />
      </form>
    </DeactivatableBox>
  );
};
