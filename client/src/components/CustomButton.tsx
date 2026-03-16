import { Button, type MantineSize } from "@mantine/core";

interface CustomButtonProps {
  text: string;
  expand?: boolean;
  size?: MantineSize;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  onClick?: () => void;
}

export const CustomButton = ({
  text,
  expand,
  size,
  type,
  disabled,
  onClick,
}: CustomButtonProps) => (
  <Button
    variant="default"
    flex={expand ? 1 : "none"}
    bdrs="md"
    size={size ?? undefined}
    disabled={disabled}
    onClick={onClick}
    type={type ?? "button"}
  >
    {text}
  </Button>
);
