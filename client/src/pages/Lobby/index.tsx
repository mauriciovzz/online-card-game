import { useCallback, useState } from "react";
import { Group, Stack } from "@mantine/core";

import { useRoom } from "@/contexts/RoomContext";
import { useChat } from "@/contexts/ChatContext";
import {
  AppBox,
  AppButton,
  AppTitle,
  ChatButton,
  InfoBox,
  SelectedRules,
  SettingsButton,
} from "@/components";
import {
  RoomUpdateForm,
  ScoreBoard,
  LobbySeats,
} from "./components";

import type { LobbyView } from "@/types";

export const Lobby = () => {
  const { room, startGame, isAdmin, resetScores } =
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

        <AppBox pos="relative">
          {view === "main" ? (
            <LobbySeats room={room}>
              <ScoreBoard
                players={room.players}
                winnerId={room.currWinner}
                isAdmin={isAdmin}
                resetScores={resetScores}
              />
            </LobbySeats>
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

        <SettingsButton />
      </Group>
    </>
  );
};
