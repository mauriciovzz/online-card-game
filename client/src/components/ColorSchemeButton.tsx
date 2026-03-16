import { useCallback } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { CustomActionIcon } from "./CustomActionIcon";

import {
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";

export const ColorSchemeButton = () => {
  const scheme = useComputedColorScheme("light");
  const isDark = scheme === "dark";

  const { setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = useCallback(() => {
    setColorScheme(isDark ? "light" : "dark");
  }, [isDark, setColorScheme]);

  const ButtonIcon = scheme === "dark" ? IconSun : IconMoon;

  return (
    <CustomActionIcon
      icon={ButtonIcon}
      onClick={toggleColorScheme}
    />
  );
};
