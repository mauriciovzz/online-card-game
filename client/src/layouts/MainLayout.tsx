import { useTranslation } from "react-i18next";
import { AppShell, Group, Text } from "@mantine/core";
import { Outlet } from "react-router";
import { ColorSchemeButton } from "../components/ColorSchemeButton";

export const MainLayout = () => {
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

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
