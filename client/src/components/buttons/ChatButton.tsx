import { Indicator } from "@mantine/core";
import {
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react";

import { useChat } from "@/contexts/ChatContext";
import { AppActionIcon } from "./AppActionIcon";

interface Props {
  expand: boolean;
  onClick: () => void;
}

export const ChatButton = ({ expand, onClick }: Props) => {
  const { chatOpened, unread, closeChat } = useChat();

  return (
    <Indicator
      inline
      disabled={unread === 0}
      label={unread.toString()}
      size={20}
      color="red"
      flex={expand ? 1 : "none"}
    >
      <AppActionIcon
        expand={expand}
        icon={chatOpened ? IconX : IconMessageCircle}
        onClick={chatOpened ? closeChat : onClick}
      />
    </Indicator>
  );
};
