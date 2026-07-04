import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Group, Modal, Stack } from "@mantine/core";

import { useRoom } from "@/contexts/RoomContext";
import {
  LangToggler,
  ThemeToggler,
  AppButton,
  HelpModal,
  HelpButton,
} from "@/components";

export const RoomSettingsModal = () => {
  const { t } = useTranslation();

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
      <Modal
        opened={settingsOpened}
        onClose={closeSettings}
        title={t("room.settings")}
        size={175}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Stack gap="sm">
          <Group gap="sm">
            <HelpButton
              expand
              onClick={() => setHelpOpened(true)}
            />

            <LangToggler expand />

            <ThemeToggler expand />
          </Group>

          {isAdmin && roomView === "game" && (
            <AppButton text="Lobby" onClick={stopGame} />
          )}

          <AppButton
            text="room.leave"
            onClick={leaveRoom}
          />
        </Stack>
      </Modal>

      <HelpModal
        opened={helpOpened}
        onClose={() => setHelpOpened(false)}
      />
    </>
  );
};
