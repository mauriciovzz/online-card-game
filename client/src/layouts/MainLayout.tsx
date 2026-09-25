import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Group, Paper, Stack, Text } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import {
  IconArrowAutofitHeight,
  IconArrowNarrowRightDashed,
  IconDeviceMobile,
  IconDeviceMobileRotated,
} from "@tabler/icons-react";

const RotateDeviceOverlay = () => {
  const { t } = useTranslation();

  return (
    <Paper
      pos="fixed"
      bdrs={0}
      style={{
        zIndex: 99999,
        display: "none",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        inset: 0,
      }}
      className="rotate-device-overlay"
    >
      <Group gap="md">
        <IconDeviceMobileRotated size={32} />
        <IconArrowNarrowRightDashed />
        <IconDeviceMobile size={32} />
      </Group>

      <Stack gap={0}>
        <Text flex={1} ta="center" fw={700}>
          {t("rotate")}
        </Text>
        <Text flex={1} ta="center">
          {t("rotateDesc")}
        </Text>
      </Stack>
    </Paper>
  );
};

const ResizeWindowOverlay = () => {
  const { t } = useTranslation();

  return (
    <Paper
      pos="fixed"
      bdrs={0}
      style={{
        zIndex: 99999,
        display: "none",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        inset: 0,
      }}
      className="resize-window-overlay"
    >
      <IconArrowAutofitHeight size={32} />

      <Stack gap={0}>
        <Text flex={1} ta="center" fw={700}>
          {t("windowHeight")}
        </Text>
        <Text flex={1} ta="center">
          {t("windowHeightDesc")}
        </Text>
      </Stack>
    </Paper>
  );
};

const TARGET_WIDTH = 500;
const TARGET_HEIGHT = 604;
const TOLERANCE = 2;

const initializeDesktopWindow = () => {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  if (!isStandalone) {
    return;
  }

  const isDesktop = window.matchMedia("(min-width: 481px)").matches;

  if (!isDesktop) {
    return;
  }

  if (localStorage.getItem("uo-window-initialized") === "true") {
    return;
  }

  const widthDifference = TARGET_WIDTH - window.innerWidth;
  const heightDifference = TARGET_HEIGHT - window.innerHeight;

  if (widthDifference !== 0 || heightDifference !== 0) {
    window.resizeBy(widthDifference, heightDifference);
  }

  requestAnimationFrame(() => {
    const widthCorrect =
      Math.abs(window.innerWidth - TARGET_WIDTH) <= TOLERANCE;

    const heightCorrect =
      Math.abs(window.innerHeight - TARGET_HEIGHT) <= TOLERANCE;

    if (widthCorrect && heightCorrect) {
      localStorage.setItem("uo-window-initialized", "true");
    }
  });
};

interface Props {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  useEffect(() => {
    initializeDesktopWindow();
  }, []);

  return (
    <Stack
      w="100%"
      h="100dvh"
      gap={0}
      justify="center"
      align="center"
      pos="relative"
      style={{ overflow: "hidden" }}
      className="mobile-padding"
    >
      <Stack
        h="100%"
        mah={{ base: "none", xs: 580 }}
        w={335}
        gap="sm"
        pos="relative"
        style={{
          minHeight: 0,
        }}
      >
        <Stack flex={1} mih={0} gap="sm" className="app-content">
          <Notifications
            position="top-center"
            notificationMaxHeight={44.19}
            pauseResetOnHover="notification"
            withinPortal={false}
            style={{ width: "100%", maxWidth: 335 }}
            styles={{ root: { position: "absolute", top: 0, height: 44.19 } }}
            zIndex={700}
          />

          {children}
        </Stack>

        <RotateDeviceOverlay />

        <ResizeWindowOverlay />
      </Stack>
    </Stack>
  );
};
