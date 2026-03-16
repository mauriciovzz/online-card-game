import { type Dispatch, type SetStateAction } from "react";
import { Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import {
  IconEdit,
  IconX,
  IconSend2,
} from "@tabler/icons-react";

import { useSocket } from "@/contexts/SocketContext";
import { useUpdateUserName } from "@/hooks/useUpdateUserName";
import { CustomActionIcon, FormInput } from "@/components";

import type { UserName } from "@/types";

interface UserNameInputProps {
  isEditable: boolean;
  setIsEditable: Dispatch<SetStateAction<boolean>>;
}

export const UserNameInput = ({
  isEditable,
  setIsEditable,
}: UserNameInputProps) => {
  const { socket, userName } = useSocket();
  const { t } = useTranslation();

  const form = useForm<UserName>({
    mode: "uncontrolled",
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

  const onFormError = (errorName: string) => {
    form.setFieldError("name", t(errorName));
  };

  useUpdateUserName(setIsEditable, onFormError);

  const startEditing = () => {
    setIsEditable(true);
  };

  const stopEditing = () => {
    setIsEditable(false);
    form.setFieldValue("name", userName);
  };

  const handleSubmit = ({ name }: UserName) => {
    if (!socket || userName === name) return;

    socket.emit("user:updateName", { newName: name });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group gap="sm" w="100%">
        <FormInput
          labelText={t("playerName")}
          errorText={form.errors.name}
          textSize="md"
          inputSize="sm"
          readOnly={!isEditable}
          form={form}
          formKey="name"
        />

        <Group gap="sm" mt={24.8}>
          {!isEditable ? (
            <CustomActionIcon
              icon={IconEdit}
              onClick={startEditing}
            />
          ) : (
            <Group gap="sm">
              <CustomActionIcon
                icon={IconX}
                onClick={stopEditing}
              />

              <CustomActionIcon
                icon={IconSend2}
                type="submit"
              />
            </Group>
          )}
        </Group>
      </Group>
    </form>
  );
};
