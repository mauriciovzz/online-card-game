import { Loader } from "@mantine/core";
import { IconCancel } from "@tabler/icons-react";

import { useIsMobile } from "@/hooks";
import { AppBox } from "@/components";

interface BaseSlotProps {
  isAvailable: boolean;
  hasPlayer?: boolean;
  color: string;
  size?: number;
  children?: React.ReactNode;
}

export const SlotBase = ({
  isAvailable,
  hasPlayer,
  color,
  size,
  children,
}: BaseSlotProps) => {
  const isMobile = useIsMobile();
  const height = isMobile ? 42 : 36;

  return (
    <AppBox
      borderColor={color}
      w={size ?? "100%"}
      h={size ?? height}
      pos="relative"
      style={{ userSelect: "none" }}
      p="sm"
    >
      {!isAvailable ? (
        <IconCancel color={color} />
      ) : hasPlayer ? (
        children
      ) : (
        <Loader size="sm" color={color} type="dots" />
      )}
    </AppBox>
  );
};
