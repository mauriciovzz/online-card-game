import { useTranslation } from "react-i18next";
import { AppShell, Group, Text } from "@mantine/core";
import { ColorSchemeButton } from "../components/ColorSchemeButton";
import type { ReactNode } from "react";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            <Text size="lg" fw={700}>
              {t("appTitle")}
            </Text>

            <Group gap={10}>
              <ColorSchemeButton />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
