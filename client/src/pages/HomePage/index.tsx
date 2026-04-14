import { useState } from "react";
import { Group, Title } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useTranslation } from "react-i18next";

import { MainLayout } from "@/layouts";
import {
  ThemeToggler,
  AppButton,
  LangToggler,
  AppActionIcon,
} from "@/components";
import {
  CreateMatch,
  RoomList,
  UserNameInput,
} from "./components";
import { IconQuestionMark } from "@tabler/icons-react";

export const HomePage = () => {
  const { t } = useTranslation();

  const [isNameEditable, setIsNameEditable] =
    useState(false);
  const [value, toggle] = useToggle(["list", "create"]);
  const isListView = value === "list";

  return (
    <MainLayout>
      <Title>Uno Online</Title>

      <UserNameInput
        isEditable={isNameEditable}
        setIsEditable={setIsNameEditable}
      />

      {isListView ? (
        <RoomList disabled={isNameEditable} />
      ) : (
        <CreateMatch disabled={isNameEditable} />
      )}

      <Group gap="sm" w="100%">
        <AppButton
          text={isListView ? t("createMatch") : t("return")}
          expand
          disabled={isNameEditable}
          onClick={toggle}
        />

        <AppActionIcon
          icon={IconQuestionMark}
          onClick={() => {
            console.log("hey");
          }}
        />

        <LangToggler />

        <ThemeToggler />
      </Group>
    </MainLayout>
  );
};
