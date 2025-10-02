import { ActionIcon } from "@mantine/core";
import type { Icon, IconProps } from "@tabler/icons-react";
import { useColorScheme } from "../hooks/useColorScheme";

interface HeaderTypes {
  toggle: () => void;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
}

export const ActionButton = ({ toggle, icon }: HeaderTypes) => {
  const ButtonIcon = icon;
  const { colorScheme } = useColorScheme();

  return (
    <ActionIcon
      variant="default"
      aria-label="ChangeHabitStyle"
      onClick={toggle}
      color={colorScheme === "dark" ? "white" : "black"}
    >
      <ButtonIcon size={19} stroke={1.5} />
    </ActionIcon>
  );
};
