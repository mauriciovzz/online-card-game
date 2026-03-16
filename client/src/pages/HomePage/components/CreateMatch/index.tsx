import { Box, Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useCreateRoom } from "@/hooks/useCreateRoom";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  CustomButton,
  FormInput,
  FormSegmentedControl,
  LabeledBox,
} from "@/components";

import type { CreateRoom } from "@/types";
import { RuleSelection } from "./RuleSelection";

interface Props {
  disabled: boolean;
}

export const CreateMatch = ({ disabled }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isMobile = useIsMobile();
  const componentSize = isMobile ? "sm" : "xs";

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
    <LabeledBox
      text={t("createMatch")}
      disabledText={t("finishUpdatingName")}
      disabled={disabled}
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >
        <Stack flex={1} gap={10}>
          <Box>
            <FormInput
              labelText={t("roomName")}
              errorText={form.errors.name}
              textSize="sm"
              inputSize={componentSize}
              form={form}
              formKey="name"
            />
          </Box>

          <Group w="100%" gap={10}>
            <FormSegmentedControl
              text={t("turnDuration")}
              size={componentSize}
              data={["30", "60", "90"]}
              form={form}
              formKey="turnDuration"
            />

            <FormSegmentedControl
              text={t("numberPlayers")}
              size={componentSize}
              data={["2", "3", "4"]}
              form={form}
              formKey="capacity"
            />
          </Group>

          <RuleSelection form={form} />
        </Stack>

        <CustomButton
          text={t("createRoom")}
          size={componentSize}
          type="submit"
          disabled={!form.values.name}
        />
      </form>
    </LabeledBox>
  );
};
