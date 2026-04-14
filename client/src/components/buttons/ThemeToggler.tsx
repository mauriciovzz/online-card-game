import { useCallback } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { AppActionIcon } from "./AppActionIcon";

import {
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";

export const ThemeToggler = () => {
  const scheme = useComputedColorScheme("light");
  const isDark = scheme === "dark";

  const { setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = useCallback(() => {
    setColorScheme(isDark ? "light" : "dark");
  }, [isDark, setColorScheme]);

  return (
    <AppActionIcon
      icon={isDark ? IconSun : IconMoon}
      onClick={toggleColorScheme}
    />
  );
};
