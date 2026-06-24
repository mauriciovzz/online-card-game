import { Group, Modal, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useRoom } from "@/contexts/RoomContext";
import {
  LangToggler,
  ThemeToggler,
  AppButton,
} from "@/components";

export const RoomSettingsModal = () => {
  const { t } = useTranslation();

  const {
    isAdmin,
    roomView,
    settingsOpened,
    closeSettings,
    stopGame,
    leaveRoom,
  } = useRoom();

  return (
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
          <LangToggler expand />

          <ThemeToggler expand />
        </Group>

        {isAdmin && roomView === "game" && (
          <AppButton text="Lobby" onClick={stopGame} />
        )}

        <AppButton text="room.leave" onClick={leaveRoom} />
      </Stack>
    </Modal>
  );
};
