import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useIsDark, useThemeColor } from "@/hooks";
import { AppBox } from "./AppBox";

const DisabledOverlay = ({ isDark }: { isDark: boolean }) => {
  const { t } = useTranslation();

  return (
    <AppBox
      pos="absolute"
      align={undefined}
      style={(theme) => ({
        inset: 0,
        backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[2],
        zIndex: 50,
      })}
    >
      <Text
        mt="sm"
        fw={700}
        style={(theme) => ({
          userSelect: "none",
          color: isDark ? theme.colors.dark[3] : theme.colors.gray[5],
        })}
      >
        {t("user.name.finishUpdate")}
      </Text>
    </AppBox>
  );
};

interface Props {
  disabled: boolean;
  children: React.ReactNode;
}

export const DeactivatableBox = ({ disabled, children }: Props) => {
  const isDark = useIsDark();
  const themeColor = useThemeColor();

  return (
    <AppBox
      pos="relative"
      style={(theme) => {
        const borderColor = disabled
          ? isDark
            ? theme.colors.dark[6]
            : theme.colors.gray[2]
          : themeColor;

        return { overflow: "hidden", border: `1px solid ${borderColor}` };
      }}
    >
      {children}

      {disabled && <DisabledOverlay isDark={isDark} />}
    </AppBox>
  );
};
