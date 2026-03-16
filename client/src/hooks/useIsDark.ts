import { useComputedColorScheme } from "@mantine/core";

export const useIsDark = () => {
  const scheme = useComputedColorScheme("light");

  return scheme === "dark";
};
