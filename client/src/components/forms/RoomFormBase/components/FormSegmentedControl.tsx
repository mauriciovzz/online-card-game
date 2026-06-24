import { SegmentedControl, Stack } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import { useIsMobile } from "@/hooks";
import { Label } from "@/components";

interface Props<T> {
  label: string;
  data: { value: string; label: string }[];
  form: UseFormReturnType<T>;
  formKey: string;
}

export const FormSegmentedControl = <T,>({
  label,
  data,
  form,
  formKey,
}: Props<T>) => {
  const isMobile = useIsMobile();

  return (
    <Stack gap={0} w="100%">
      <Label size="sm" text={label} />
      <SegmentedControl
        size={isMobile ? "md" : "sm"}
        data={data}
        key={form.key(formKey)}
        {...form.getInputProps(formKey)}
      />
    </Stack>
  );
};
