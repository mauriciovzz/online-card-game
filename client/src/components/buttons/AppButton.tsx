import { useTranslation } from "react-i18next";
import { Button } from "@mantine/core";

import { useIsMobile } from "@/hooks";

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
  const { t } = useTranslation();
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
      {t(text)}
    </Button>
  );
};
