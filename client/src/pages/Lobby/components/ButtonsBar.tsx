import {
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Group } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

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
  const { startGame, isAdmin, openSettings } = useRoom();
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
      {isAdmin && (
        <>
          <AppButton
            text={"room.start"}
            expand
            disabled={!canStartGame}
            onClick={startGame}
          />
          <AppButton
            text={
              view === "edit"
                ? "common.return"
                : "room.edit"
            }
            expand
            onClick={toggleEdit}
          />
        </>
      )}

      <ChatButton expand={!isAdmin} onClick={toggleChat} />

      <AppActionIcon
        expand={!isAdmin}
        onClick={openSettings}
      >
        <IconSettings size={20} stroke={2} />
      </AppActionIcon>
    </Group>
  );
};
