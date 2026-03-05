import { ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useColorScheme } from "../hooks/useColorScheme";

export const ColorSchemeButton = () => {
  const { colorScheme, toggleColorScheme } =
    useColorScheme();
  const ButtonIcon =
    colorScheme === "dark" ? IconSun : IconMoon;

  return (
    <ActionIcon
      size={36}
      variant="default"
      aria-label="ChangeHabitStyle"
      onClick={toggleColorScheme}
      color={colorScheme === "dark" ? "white" : "black"}
    >
      <ButtonIcon size={19} stroke={1.5} />
    </ActionIcon>
  );
};
