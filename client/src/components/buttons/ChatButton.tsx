import { Indicator } from "@mantine/core";
import {
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react";

import { useChat } from "@/contexts/ChatContext";
import { AppActionIcon } from "./AppActionIcon";

interface Props {
  expand: boolean;
}

export const ChatButton = ({ expand }: Props) => {
  const { chatOpened, unread, openChat, closeChat } =
    useChat();

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
        onClick={chatOpened ? closeChat : openChat}
      />
    </Indicator>
  );
};
