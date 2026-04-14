import { useIsMobile } from "@/hooks/useIsMobile";
import { Button } from "@mantine/core";

interface Props {
  type?: "button" | "reset" | "submit";
  text: string;
  expand?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const AppButton = ({
  type,
  text,
  expand,
  disabled,
  onClick,
}: Props) => {
  const isMobile = useIsMobile();

  return (
    <Button
      type={type ?? "button"}
      variant="default"
      size={isMobile ? "md" : "sm"}
      flex={expand ? 1 : "none"}
      bdrs="md"
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
