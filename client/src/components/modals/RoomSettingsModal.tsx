import { useState } from "react";
import { Group } from "@mantine/core";

import { useRoom } from "@/contexts/RoomContext";
import {
  LangToggler,
  ThemeToggler,
  AppButton,
  HelpModal,
  HelpButton,
} from "@/components";
import { AppModal } from "./AppModal";

export const RoomSettingsModal = () => {
  const {
    isAdmin,
    roomView,
    stopGame,
    leaveRoom,
    settingsOpened,
    closeSettings,
  } = useRoom();

  const [helpOpened, setHelpOpened] = useState(false);

  return (
    <>
      <AppModal
        opened={settingsOpened}
        close={closeSettings}
        title="room.settings"
        width={235}
        index={800}
      >
        <Group gap="sm">
          <HelpButton
            expand
            onClick={() => {
              setHelpOpened(true);
            }}
          />

          <LangToggler expand />

          <ThemeToggler expand />
        </Group>

        {isAdmin && roomView === "game" && (
          <AppButton text="Lobby" onClick={stopGame} />
        )}

        <AppButton text="room.leave" onClick={leaveRoom} />
      </AppModal>

      <HelpModal
        opened={helpOpened}
        onClose={() => {
          setHelpOpened(false);
        }}
      />
    </>
  );
};
