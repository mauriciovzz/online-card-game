import {
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
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
  Label,
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

  const { userName } = useSocket();

  const form = useForm<UserName>({
    initialValues: {
      name: userName,
    },

    validate: {
      name: (value) => {
        if (value.length < 1)
          return t("errors.common.empty");
        if (value.length > 10)
          return t("errors.name.maxLength");
        return null;
      },
    },
  });

  const onFormSuccess = useCallback(() => {
    setIsEditable(false);
    inputRef.current?.blur();
  }, [setIsEditable]);

  const onFormError = useCallback(
    (errorName: string) => {
      const map: Record<string, string> = {
        NAME_EMPTY: "errors.name.empty",
        NAME_MAX_LENGTH: "errors.name.maxLength",
        NAME_TAKEN: "errors.name.taken",
      };

      form.setFieldError("name", t(map[errorName]));
    },
    [form, t]
  );

  const { updateUserName } = useUpdateUserName(
    onFormSuccess,
    onFormError
  );

  const handleSubmit = ({ name }: UserName) => {
    if (userName.trim() === name.trim()) return;

    updateUserName(name);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const isUnchanged = form.values.name === userName;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group gap="sm" w="100%">
        <Stack gap={0} flex={1}>
          <Label
            text={t("user.name.label")}
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
                disabled={isUnchanged}
              />
            </Group>
          )}
        </Group>
      </Group>
    </form>
  );
};
