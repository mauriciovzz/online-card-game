import { Group, Modal, Stack } from "@mantine/core";

import { useRoom } from "@/contexts/RoomContext";
import { LangToggler } from "../buttons/LangToggler";
import { ThemeToggler } from "../buttons/ThemeToggler";
import { AppButton } from "../buttons/AppButton";
import { useTranslation } from "react-i18next";

export const RoomSettingsModal = () => {
  const { t } = useTranslation();
  const { settingsOpened, closeSettings, leaveRoom } =
    useRoom();

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

        <AppButton text="room.leave" onClick={leaveRoom} />
      </Stack>
    </Modal>
  );
};
