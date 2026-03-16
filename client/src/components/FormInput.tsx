import type { ReactNode } from "react";
import {
  Stack,
  Group,
  Text,
  TextInput,
  type MantineSize,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

import { InputLabel } from "./InputLabel";
import type { UseFormReturnType } from "@mantine/form";

interface Props<T> {
  labelText: string;
  errorText?: ReactNode;
  textSize: MantineSize;

  inputSize: MantineSize;
  readOnly?: boolean;
  form: UseFormReturnType<T>;
  formKey: string;
}

export const FormInput = <T,>({
  labelText,
  textSize,
  errorText,
  inputSize,
  readOnly,
  form,
  formKey,
}: Props<T>) => {
  const { t } = useTranslation();

  return (
    <Stack gap={0} flex={1}>
      <Group>
        <InputLabel text={labelText} size={textSize} />
        <Text flex={1} c="red" size="xs" ta="right">
          {errorText}
        </Text>
      </Group>

      <TextInput
        radius="md"
        size={inputSize}
        placeholder={t("namePlaceholder")}
        key={form.key(formKey)}
        readOnly={readOnly}
        {...form.getInputProps("name")}
        error={false}
        spellCheck={false}
      />
    </Stack>
  );
};
