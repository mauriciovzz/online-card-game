import { Stack } from "@mantine/core";

import { useIsDark } from "@/hooks/useIsDark";
import { DisabledOverlay } from "./DisabledOverlay";
import { InputLabel } from "./InputLabel";

interface Props {
  text: string;
  disabledText: string;
  disabled: boolean;
  children: React.ReactNode;
}
export const LabeledBox = ({
  text,
  disabledText,
  disabled,
  children,
}: Props) => {
  const isDark = useIsDark();

  return (
    <Stack gap={0} h="100%" w="100%">
      <InputLabel text={text} />

      <Stack
        w="100%"
        h="100%"
        bdrs="md"
        gap={0}
        pos="relative"
        style={(theme) => {
          const borderColor = disabled
            ? isDark
              ? theme.colors.dark[6]
              : theme.colors.gray[2]
            : isDark
              ? theme.colors.dark[4]
              : theme.colors.gray[3];

          return {
            border: `1px solid ${borderColor}`,
            overflow: "hidden",
          };
        }}
      >
        {children}

        {disabled && (
          <DisabledOverlay text={disabledText} />
        )}
      </Stack>
    </Stack>
  );
};
