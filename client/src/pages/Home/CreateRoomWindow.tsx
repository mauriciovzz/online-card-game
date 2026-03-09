import { useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";
import {
  Box,
  Text,
  Button,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  TextInput,
  CloseButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { InputLabel } from "../../components/InputLabel";
import type {
  CreateRoom,
  RoomId,
  RoomRules,
  SocketRes,
} from "../../types/types";
import { useTranslation } from "react-i18next";

const RuleButton = ({
  name,
  state,
  onClick,
}: {
  name: string;
  state: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      flex={1}
      variant={state ? "filled" : "default"}
      color="green"
      onClick={onClick}
    >
      <Text size="sm">{name}</Text>
    </Button>
  );
};

const rules = ["mirror", "stair", "stack"];

interface CreateRoomProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (roomId: string) => void;
}

export const CreateRoomWindow = ({
  opened,
  onClose,
  onCreate,
}: CreateRoomProps) => {
  const { socket } = useSocket();
  const { t } = useTranslation();

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
        if (value.length === 0) return t("ROOM_MIN_LENGTH");
        if (value.length > 20) return t("ROOM_MAX_LENGTH");
        return null;
      },
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (res: SocketRes<RoomId>) => {
      if (res.success) {
        onCreate(res.data.roomId);
      }
    };

    socket.on("room:created", handleCreated);

    return () => {
      socket.off("room:created", handleCreated);
    };
  }, [form, onCreate, socket]);

  const submitCreateRoom = (newRoom: CreateRoom) => {
    if (socket) {
      socket.emit("room:create", newRoom);
    }
  };

  const closeForm = () => {
    onClose();
    form.reset();
  };

  const getRuleValue = (rule: string) => {
    return form.getValues().rules[rule as keyof RoomRules];
  };

  const handleRuleClick = (rule: string) => {
    form.setValues({
      rules: {
        ...form.getValues().rules,
        [rule]:
          !form.getValues().rules[rule as keyof RoomRules],
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={closeForm}
      withCloseButton={false}
      centered
    >
      <form onSubmit={form.onSubmit(submitCreateRoom)}>
        <Stack gap="md">
          <Group justify="space-between">
            {t("newRoom")}
            <CloseButton onClick={closeForm} />
          </Group>

          <Box>
            <InputLabel text={t("roomName")} />
            <TextInput
              radius="md"
              size="md"
              h={63.8}
              placeholder={t("roomNamePlaceholder")}
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          </Box>

          <Box>
            <InputLabel text={t("turnDuration")} />
            <SegmentedControl
              w="100%"
              data={["30", "60", "90"]}
              color="red"
              key={form.key("turnDuration")}
              {...form.getInputProps("turnDuration")}
            />
          </Box>

          <Box>
            <InputLabel text={t("numberPlayers")} />
            <SegmentedControl
              w="100%"
              data={["2", "3", "4"]}
              color="yellow"
              key={form.key("capacity")}
              {...form.getInputProps("capacity")}
            />
          </Box>

          <Box>
            <InputLabel text={t("rules")} />
            <Group gap="md">
              {rules.map((rule) => (
                <RuleButton
                  key={rule}
                  name={t(rule)}
                  state={getRuleValue(rule)}
                  onClick={() => {
                    handleRuleClick(rule);
                  }}
                />
              ))}
            </Group>
          </Box>

          <Button type="submit">{t("createRoom")}</Button>
        </Stack>
      </form>
    </Modal>
  );
};
