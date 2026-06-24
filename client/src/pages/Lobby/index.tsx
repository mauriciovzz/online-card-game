import { useCallback, useState } from "react";
import { Group, Stack } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

import { useRoom } from "@/contexts/RoomContext";
import { useChat } from "@/contexts/ChatContext";
import {
  AppActionIcon,
  AppBox,
  AppButton,
  AppTitle,
  ChatButton,
  InfoBox,
  SelectedRules,
} from "@/components";
import { RoomSeats, RoomUpdateForm } from "./components";

import type { LobbyView } from "@/types";

export const Lobby = () => {
  const { room, startGame, isAdmin, openSettings } =
    useRoom();
  const { openChat, closeChat } = useChat();

  const [view, setView] = useState<LobbyView>("main");

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
    <>
      <Stack h="100%" gap="sm">
        <AppTitle text={room.name} />

        <Group gap="sm">
          <InfoBox
            text="room.turnDuration"
            info={room.turnDuration + "s"}
          />

          <InfoBox
            text={"rules.title"}
            info={<SelectedRules rules={room.rules} />}
          />
        </Group>

        <AppBox>
          {view === "main" ? (
            <RoomSeats room={room} />
          ) : (
            <RoomUpdateForm
              room={room}
              close={() => setView("main")}
            />
          )}
        </AppBox>
      </Stack>

      {/* LobbyBar */}
      <Group gap="sm">
        {isAdmin && (
          <>
            <AppButton
              text={"room.start"}
              expand
              disabled={room.players.length === 1}
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

        <ChatButton
          expand={!isAdmin}
          onClick={toggleChat}
        />

        <AppActionIcon
          expand={!isAdmin}
          onClick={openSettings}
        >
          <IconSettings size={20} stroke={2} />
        </AppActionIcon>
      </Group>
    </>
  );
};
