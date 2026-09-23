import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Stack, Flex, Text, Divider, Button } from "@mantine/core";

import { useIsDark, useIsMobile } from "@/hooks";

interface Props {
  opened: boolean;
  close: () => void;
  title: string;
  width: string | number;
  index: number;
  children: ReactNode;
}

export const AppModal = ({
  opened,
  close,
  title,
  width,
  index,
  children,
}: Props) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isDark = useIsDark();

  return (
    <Modal.Root
      opened={opened}
      onClose={close}
      size="auto"
      trapFocus={false}
      centered
      zIndex={index}
      transitionProps={{
        transition: "pop",
        duration: 300,
        exitDuration: 300,
        timingFunction: "linear",
      }}
    >
      <Modal.Overlay
        backgroundOpacity={0.5}
        blur={5}
        bdrs={isMobile ? "16px 16px 0 0" : undefined}
      />

      <Modal.Content
        w={width}
        radius="lg"
        bd="1px solid var(--mantine-color-default-border)"
      >
        <Modal.Body>
          <Stack gap="sm">
            <Flex
              bg={
                isDark
                  ? "var(--mantine-color-dark-4)"
                  : "var(--mantine-color-gray-5)"
              }
              px="sm"
              bdrs="md"
              align="center"
            >
              <Text flex={1} p={0} ta="left" size="lg" c="white" fw={700}>
                {t(title)}
              </Text>

              <Button
                variant="transparent"
                size="compact-xs"
                p={0}
                color="white"
                onClick={close}
              >
                {t("common.return")}
              </Button>
            </Flex>

            <Divider />

            {children}
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
