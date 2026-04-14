import { SegmentedControl } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

import { useIsMobile } from "@/hooks/useIsMobile";

interface Props<T> {
  data: { value: string; label: string }[];
  form: UseFormReturnType<T>;
  formKey: string;
}

export const FormSegmentedControl = <T,>({
  data,
  form,
  formKey,
}: Props<T>) => {
  const isMobile = useIsMobile();

  return (
    <SegmentedControl
      size={isMobile ? "md" : "sm"}
      data={data}
      key={form.key(formKey)}
      {...form.getInputProps(formKey)}
    />
  );
};
