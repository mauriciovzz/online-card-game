import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";

export function useColorScheme() {
  const { setColorScheme } = useMantineColorScheme();

  const colorScheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  // const theme = useMantineTheme();
  // const themeBorderColor = colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3];
  // const themeTextColor = colorScheme === "dark" ? "#C9C9C9" : "black";

  return { colorScheme, toggleColorScheme };
}
