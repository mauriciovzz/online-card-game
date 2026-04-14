import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { TURN_DURATIONS } from "@/constants";
import {
  FormRuleSelector,
  AppButton,
  Label,
  FormSegmentedControl,
  AppBox,
} from "@/components";

import type { CreateRoom } from "@/types";
import { useThemeColor } from "@/hooks/useThemeColor";

export const EditRoom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const themeColor = useThemeColor();

  const { socket } = useSocket();

  const form = useForm<CreateRoom>({
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

  useCreateRoom(onFormSuccess, onFormError);

  const handleSubmit = (newRoom: CreateRoom) => {
    socket?.emit("room:create", newRoom);
  };

  return (
    <AppBox borderColor={themeColor}>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{
          height: "100%",
          width: "100%",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack flex={1} gap="sm">
          <Stack gap={0} w="100%">
            <Label text={t("turnDuration")} size="sm" />
            <FormSegmentedControl
              data={TURN_DURATIONS}
              form={form}
              formKey="turnDuration"
            />
          </Stack>

          <FormRuleSelector form={form} />
        </Stack>

        <AppButton type="submit" text="Save changes" />
      </form>
    </AppBox>
  );
};
