import { useIsMobile } from "@/hooks";
import { Modal, Paper, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export const HelpModal = ({ opened, onClose }: Props) => {
  const { t } = useTranslation();

  const isMobile = useIsMobile();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("Help")}
      size={isMobile ? "calc(100vh - 32px)" : 340}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      styles={{
        content: {
          height: "calc(100vh - 32px)",
          maxHeight: "calc(100vh - 32px)",
        },
        body: {
          height: "calc(100vh - 60px - 32px)",
        },
      }}
    >
      <Paper withBorder p="sm" h="100%">
        j
      </Paper>
    </Modal>
  );
};
