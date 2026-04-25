import { Indicator } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

import { AppActionIcon } from "@/components";

interface Props {
  isMobile: boolean;
  unread: number;
  onClick: () => void;
}

export const ScrollDownButton = ({
  isMobile,
  unread,
  onClick,
}: Props) => {
  return (
    <Indicator
      inline
      disabled={unread === 0}
      label={unread}
      size={20}
      color="red"
      position="middle-start"
      pos="absolute"
      bottom={0}
      right={isMobile ? 0 : 8}
    >
      <AppActionIcon
        icon={IconChevronDown}
        onClick={() => onClick()}
      />
    </Indicator>
  );
};
