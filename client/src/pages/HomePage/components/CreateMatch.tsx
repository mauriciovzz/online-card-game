import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { useIsMobile } from "@/hooks/useIsMobile";
import { TURN_DURATIONS } from "@/constants";
import {
  FormRuleSelector,
  AppButton,
  FormInput,
  DeactivatableBox,
  Label,
  LabelWithError,
  FormSegmentedControl,
} from "@/components";

import type { CreateRoom } from "@/types";

const PLAYERS_OPTIONS = [
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
];

interface Props {
  disabled: boolean;
}

export const CreateMatch = ({ disabled }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { socket } = useSocket();
  const isMobile = useIsMobile();

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
        <Stack flex={1} gap="sm">
          <Stack gap={0}>
            <LabelWithError
              text={t("roomName")}
              size="sm"
              error={form.errors.name}
            />
            <FormInput
              form={form}
              formKey="name"
              blurOnEnter
            />
          </Stack>

          <Flex
            direction={isMobile ? "column" : "row"}
            gap="sm"
          >
            <Stack gap={0} w="100%">
              <Label text={t("turnDuration")} size="sm" />
              <FormSegmentedControl
                data={TURN_DURATIONS}
                form={form}
                formKey="turnDuration"
              />
            </Stack>

            <Stack gap={0} w="100%">
              <Label text={t("numberPlayers")} size="sm" />
              <FormSegmentedControl
                data={PLAYERS_OPTIONS}
                form={form}
                formKey="capacity"
              />
            </Stack>
          </Flex>

          <FormRuleSelector form={form} />
        </Stack>

        <AppButton
          type="submit"
          text={t("createRoom")}
          disabled={!form.values.name}
        />
      </form>
    </DeactivatableBox>
  );
};
