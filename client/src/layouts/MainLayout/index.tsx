import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { Group, Paper, Stack, Text } from "@mantine/core";
import {
  useElementSize,
  useViewportSize,
} from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";

import classes from "./MainLayout.module.css";

import type { MainLayoutContextType } from "@/types";
import {
  IconArrowNarrowRightDashed,
  IconDeviceMobile,
  IconDeviceMobileRotated,
} from "@tabler/icons-react";

const RotateDeviceOverlay = () => {
  const { t } = useTranslation();

  return (
    <Paper
      h="100%"
      w="100%"
      pos="fixed"
      style={{
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        inset: 0,
      }}
    >
      <Group gap="md">
        <IconDeviceMobileRotated size={32} />
        <IconArrowNarrowRightDashed />
        <IconDeviceMobile size={32} />
      </Group>

      <Stack gap={0}>
        <Text flex={1} ta="center" fw={700}>
          {t("common.rotate")}
        </Text>
        <Text flex={1} ta="center">
          {t("common.rotateDesc")}
        </Text>
      </Stack>
    </Paper>
  );
};

interface Props {
  children?: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  const { ref, height } = useElementSize();

  const { width: windowW, height: windowH } =
    useViewportSize();

  const isLandscape = windowW > windowH;
  const isScreenTooSmall = windowW < 335 || windowH < 620;

  const shouldRotate = isLandscape && isScreenTooSmall;

  const context = {
    layoutHeight: height,
  } satisfies MainLayoutContextType;

  return (
    <Stack
      w="100%"
      h="100dvh"
      gap={0}
      justify="center"
      align="center"
      py={24}
      pos="relative"
      style={{
        touchAction: "none",
      }}
    >
      <Stack
        ref={ref}
        h="100%"
        w="100%"
        maw={335}
        gap="sm"
        pos="relative"
        className={classes.app}
      >
        {children ?? (
          <>
            <Notifications
              position="top-center"
              notificationMaxHeight={44.19}
              pauseResetOnHover="notification"
              withinPortal={false}
              style={{ width: "100%", maxWidth: 335 }}
              styles={{
                root: {
                  position: "absolute",
                  top: 0,
                  height: 44.19,
                },
              }}
            />
            <Outlet context={context} />
          </>
        )}
      </Stack>

      {shouldRotate && <RotateDeviceOverlay />}
    </Stack>
  );
};
