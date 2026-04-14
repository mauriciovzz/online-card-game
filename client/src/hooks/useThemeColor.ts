import { useMantineTheme } from "@mantine/core";

import { useIsDark } from "./useIsDark";

export const useThemeColor = () => {
  const theme = useMantineTheme();

  const isDark = useIsDark();

  return isDark
    ? theme.colors.dark[4]
    : theme.colors.gray[3];
};
