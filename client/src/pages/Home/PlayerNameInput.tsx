import {
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Group,
  TextInput,
  ActionIcon,
  Box,
  Stack,
} from "@mantine/core";
import { type UseFormReturnType } from "@mantine/form";
import { useSocket } from "../../contexts/SocketContext";
import {
  IconEdit,
  IconX,
  IconSend2,
} from "@tabler/icons-react";
import { InputLabel } from "../../components/InputLabel";
import { useTranslation } from "react-i18next";
import type {
  SocketRes,
  UserName,
} from "../../types/types";

interface PlayerNameInputProps {
  isEditable: boolean;
  setIsEditable: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturnType<
    UserName,
    (values: UserName) => UserName
  >;
  stopEditing: () => void;
}

export const PlayerNameInput = ({
  isEditable,
  setIsEditable,
  form,
  stopEditing,
}: PlayerNameInputProps) => {
  const { socket, userName, setUserName } = useSocket();

  const { t } = useTranslation();

  useEffect(() => {
    if (!socket) return;

    const handleNameUpdated = (
      res: SocketRes<UserName>
    ) => {
      if (res.success) {
        setUserName(res.data.name);
        setIsEditable(false);
      } else {
        form.setFieldError("newUserName", t(res.error));
      }
    };

    socket.on("user:nameUpdated", handleNameUpdated);

    return () => {
      socket.off("user:nameUpdated", handleNameUpdated);
    };
  }, [form, setIsEditable, setUserName, socket, t]);

  const submitUpdateUsername = ({ name }: UserName) => {
    if (socket && userName !== name) {
      socket.emit("user:updateName", { newName: name });
    }
  };

  return (
    <Stack gap={0} w="100%">
      <InputLabel text={t("playerName")} />
      <form onSubmit={form.onSubmit(submitUpdateUsername)}>
        <Group w="100%" h={55.39} gap="xs">
          <Box h="100%" flex={1}>
            <TextInput
              radius="md"
              size="md"
              key={form.key("name")}
              {...form.getInputProps("name")}
              readOnly={!isEditable}
              spellCheck={false}
            />
          </Box>

          <Box h="100%">
            {!isEditable ? (
              <ActionIcon
                color="red"
                size="42px"
                radius="md"
                onClick={() => {
                  setIsEditable(true);
                }}
              >
                <IconEdit size={28} stroke={1.5} />
              </ActionIcon>
            ) : (
              <Group gap="xs">
                <ActionIcon
                  color="red"
                  size="42px"
                  radius="md"
                  onClick={stopEditing}
                >
                  <IconX size={28} stroke={1.5} />
                </ActionIcon>

                <ActionIcon
                  color="red"
                  size="42px"
                  radius="md"
                  component="button"
                  type="submit"
                >
                  <IconSend2 size={28} stroke={1.5} />
                </ActionIcon>
              </Group>
            )}
          </Box>
        </Group>
      </form>
    </Stack>
  );
};
