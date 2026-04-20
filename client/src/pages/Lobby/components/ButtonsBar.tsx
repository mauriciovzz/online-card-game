import {
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import { Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconX,
  IconSettings,
} from "@tabler/icons-react";

import { useChat } from "@/contexts/ChatContext";
import {
  AppActionIcon,
  AppButton,
  ChatButton,
} from "@/components";

import type { Room, View } from "@/types";
import { useRoom } from "@/contexts/RoomContext";

interface Props {
  room: Room;
  view: View;
  setView: Dispatch<SetStateAction<View>>;
}

export const ButtonsBar = ({
  room,
  view,
  setView,
}: Props) => {
  const { t } = useTranslation();

  const { leaveRoom, startGame, isAdmin } = useRoom();
  const { openChat } = useChat();

  const toggleEdit = useCallback(() => {
    setView((prevView) =>
      prevView === "edit" ? "lobby" : "edit"
    );
  }, [setView]);

  const toggleChat = useCallback(() => {
    setView((prevView) =>
      prevView === "edit" ? "lobby" : prevView
    );
    openChat();
  }, [openChat, setView]);

  return (
    <Group gap="sm">
      <AppActionIcon
        icon={IconChevronLeft}
        expand={!isAdmin}
        onClick={leaveRoom}
      />

      {isAdmin && (
        <>
          <AppButton
            text={t("room.startGame")}
            expand
            disabled={room.players.length === 1}
            onClick={startGame}
          />

          <AppActionIcon
            icon={view === "edit" ? IconX : IconSettings}
            onClick={toggleEdit}
          />
        </>
      )}

      <ChatButton expand={!isAdmin} onClick={toggleChat} />
    </Group>
  );
};
