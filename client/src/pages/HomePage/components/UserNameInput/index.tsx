import {
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { flushSync } from "react-dom";
import { Group, Stack } from "@mantine/core";
import {
  IconEdit,
  IconX,
  IconSend2,
} from "@tabler/icons-react";

import { useUpdateUserName } from "./useUpdateUserName";
import {
  AppActionIcon,
  FormInput,
  Label,
} from "@/components";

interface Props {
  isEditable: boolean;
  setIsEditable: Dispatch<SetStateAction<boolean>>;
}

export const UserNameInput = ({
  isEditable,
  setIsEditable,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUpdate = useCallback(() => {
    setIsEditable(false);
    inputRef.current?.blur();
  }, [setIsEditable]);

  const { userName, form, updateUserName } =
    useUpdateUserName(onUpdate);

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

  return (
    <form onSubmit={form.onSubmit(updateUserName)}>
      <Group gap="sm" w="100%">
        <Stack gap={0} flex={1}>
          <Label
            text={"user.name.label"}
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
                disabled={form.values.name === userName}
              />
            </Group>
          )}
        </Group>
      </Group>
    </form>
  );
};
