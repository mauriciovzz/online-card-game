import {
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconX,
  IconSettings,
} from "@tabler/icons-react";

import { useRoom } from "@/contexts/RoomContext";
import { useChat } from "@/contexts/ChatContext";
import {
  AppActionIcon,
  AppButton,
  ChatButton,
} from "@/components";

import type { View } from "@/types";

interface Props {
  view: View;
  setView: Dispatch<SetStateAction<View>>;
  canStartGame: boolean;
}

export const ButtonsBar = ({
  view,
  setView,
  canStartGame,
}: Props) => {
  const { leaveRoom, startGame, isAdmin } = useRoom();
  const { openChat, closeChat } = useChat();

  const toggleEdit = useCallback(() => {
    setView((prevView) =>
      prevView === "edit" ? "main" : "edit"
    );
    closeChat();
  }, [closeChat, setView]);

  const toggleChat = useCallback(() => {
    setView((prevView) =>
      prevView === "edit" ? "main" : prevView
    );
    openChat();
  }, [openChat, setView]);

  return (
    <Group gap="sm">
      <AppActionIcon
        icon={IconChevronLeft}
        onClick={leaveRoom}
      />

      {isAdmin && (
        <AppButton
          text={"room.startGame"}
          expand
          disabled={!canStartGame}
          onClick={startGame}
        />
      )}

      <ChatButton expand={!isAdmin} onClick={toggleChat} />

      {isAdmin && (
        <AppActionIcon
          icon={view === "edit" ? IconX : IconSettings}
          onClick={toggleEdit}
        />
      )}
    </Group>
  );
};
