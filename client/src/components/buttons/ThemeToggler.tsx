import { useCallback } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

import { AppActionIcon } from "./AppActionIcon";

import {
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";

interface Props {
  expand?: boolean;
}

export const ThemeToggler = ({ expand }: Props) => {
  const scheme = useComputedColorScheme("light");
  const isDark = scheme === "dark";

  const { setColorScheme } = useMantineColorScheme();

  const toggleColor = useCallback(() => {
    setColorScheme(isDark ? "light" : "dark");
  }, [isDark, setColorScheme]);

  return (
    <AppActionIcon expand={expand} onClick={toggleColor}>
      {isDark ? (
        <IconSun size={20} stroke={2} />
      ) : (
        <IconMoon size={20} stroke={2} />
      )}
    </AppActionIcon>
  );
};
