import { useTranslation } from "react-i18next";
import { Button } from "@mantine/core";

import { useIsMobile } from "@/hooks";

interface Props {
  type?: "button" | "reset" | "submit";
  text: string;
  expand?: boolean;
  color?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const AppButton = ({
  type,
  text,
  expand,
  color,
  disabled,
  onClick,
}: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <Button
      type={type ?? "button"}
      variant={color ? "outline" : "default"}
      color={color ?? undefined}
      size={isMobile ? "md" : "sm"}
      flex={expand ? 1 : "none"}
      bdrs="md"
      disabled={disabled}
      onClick={onClick}
    >
      {t(text)}
    </Button>
  );
};
