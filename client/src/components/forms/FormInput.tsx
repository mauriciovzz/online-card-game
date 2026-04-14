import type { RefObject } from "react";
import { TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks/useIsMobile";

interface Props<T> {
  ref?: RefObject<HTMLInputElement | null>;
  form: UseFormReturnType<T>;
  formKey: string;
  readOnly?: boolean;
  blurOnEnter?: boolean;
}

export const FormInput = <T,>({
  ref,
  form,
  formKey,
  readOnly,
  blurOnEnter,
}: Props<T>) => {
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter") return;

    if (blurOnEnter) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <TextInput
      ref={ref}
      placeholder={t("namePlaceholder")}
      size={isMobile ? "md" : "sm"}
      radius="md"
      key={form.key(formKey)}
      {...form.getInputProps(formKey)}
      error={false}
      spellCheck={false}
      readOnly={readOnly}
      onKeyDown={handleKeyDown}
      styles={
        readOnly
          ? {
              input: {
                userSelect: "none",
                pointerEvents: "none",
              },
            }
          : undefined
      }
    />
  );
};
