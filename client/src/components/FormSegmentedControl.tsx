import {
  SegmentedControl,
  Stack,
  type MantineSize,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import { InputLabel } from "./InputLabel";

interface Props<T> {
  text: string;
  size: MantineSize;
  data: string[];
  form: UseFormReturnType<T>;
  formKey: string;
}

export const FormSegmentedControl = <T,>({
  text,
  size,
  data,
  form,
  formKey,
}: Props<T>) => {
  return (
    <Stack flex={1} gap={0}>
      <InputLabel text={text} size="sm" />
      <SegmentedControl
        size={size}
        data={data}
        key={form.key(formKey)}
        {...form.getInputProps(formKey)}
      />
    </Stack>
  );
};
