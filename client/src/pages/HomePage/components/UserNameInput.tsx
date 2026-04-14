import {
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { flushSync } from "react-dom";
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import {
  IconEdit,
  IconX,
  IconSend2,
} from "@tabler/icons-react";

import { useSocket } from "@/contexts/SocketContext";
import { useUpdateUserName } from "@/hooks/useUpdateUserName";
import {
  AppActionIcon,
  FormInput,
  LabelWithError,
} from "@/components";

import type { UserName } from "@/types";

interface Props {
  isEditable: boolean;
  setIsEditable: Dispatch<SetStateAction<boolean>>;
}

export const UserNameInput = ({
  isEditable,
  setIsEditable,
}: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { socket, userName } = useSocket();

  const startEditing = () => {
    flushSync(() => {
      setIsEditable(true);
    });
    inputRef.current?.focus();
  };

  const stopEditing = () => {
    setIsEditable(false);
    form.setFieldValue("name", userName);
    inputRef.current?.blur();
  };

  const form = useForm<UserName>({
    initialValues: {
      name: userName,
    },

    validate: {
      name: (value) => {
        if (value.length < 1) return t("EMPTY");
        if (value.length > 10) return t("NAME_MAX_LENGTH");
        return null;
      },
    },
  });

  const isUnchanged = form.values.name === userName;

  const handleSubmit = ({ name }: typeof form.values) => {
    if (!socket || userName.trim() === name.trim()) return;

    socket.emit("user:updateName", { newName: name });
  };

  const onFormSuccess = useCallback(() => {
    setIsEditable(false);
    inputRef.current?.blur();
  }, [setIsEditable]);

  const onFormError = useCallback(
    (errorName: string) => {
      form.setFieldError("name", t(errorName));
    },
    [form, t]
  );

  useUpdateUserName(onFormSuccess, onFormError);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group gap="sm" w="100%">
        <Stack gap={0} flex={1}>
          <LabelWithError
            text={t("playerName")}
            error={form.errors.name}
          />
          <FormInput
            ref={inputRef}
            form={form}
            formKey="name"
            readOnly={!isEditable}
          />
        </Stack>

        <Group gap="sm" mt={24.8}>
          {!isEditable ? (
            <AppActionIcon
              icon={IconEdit}
              onClick={startEditing}
            />
          ) : (
            <Group gap="sm">
              <AppActionIcon
                icon={IconX}
                onClick={stopEditing}
              />

              <AppActionIcon
                icon={IconSend2}
                type="submit"
                disabled={!form.isValid() || isUnchanged}
              />
            </Group>
          )}
        </Group>
      </Group>
    </form>
  );
};
