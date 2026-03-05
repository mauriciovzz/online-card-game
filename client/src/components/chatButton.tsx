import { Indicator, ActionIcon } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";

interface ChatButtonProps {
  unreadMessages: number;
  onClick: () => void;
}

export const ChatButton = ({
  unreadMessages,
  onClick,
}: ChatButtonProps) => {
  return (
    <Indicator
      inline
      disabled={unreadMessages === 0}
      label={unreadMessages.toString()}
      size="lg"
      color="red"
    >
      <ActionIcon variant="default" onClick={onClick}>
        <IconMessageCircle size={19} stroke={1.5} />
      </ActionIcon>
    </Indicator>
  );
};
