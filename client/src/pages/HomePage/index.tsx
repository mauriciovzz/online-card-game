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
  CreateRoom,
  RoomList,
  UserNameInput,
} from "./components";
import { IconQuestionMark } from "@tabler/icons-react";
import { useNotification } from "@/hooks/useNotfication";

export const HomePage = () => {
  const { t } = useTranslation();

  const { onSuccess } = useNotification();

  const [isEditable, setIsEditable] = useState(false);

  const [value, toggle] = useToggle(["list", "create"]);
  const isListView = value === "list";

  return (
    <MainLayout>
      <Title>Uno Online</Title>

      <UserNameInput
        isEditable={isEditable}
        setIsEditable={setIsEditable}
      />

      {isListView ? (
        <RoomList disabled={isEditable} />
      ) : (
        <CreateRoom disabled={isEditable} />
      )}

      <Group gap="sm" w="100%">
        <AppButton
          text={
            isListView
              ? t("room.create")
              : t("common.return")
          }
          expand
          disabled={isEditable}
          onClick={toggle}
        />

        <AppActionIcon
          icon={IconQuestionMark}
          onClick={() => {
            onSuccess("hey");
          }}
        />

        <LangToggler />

        <ThemeToggler />
      </Group>
    </MainLayout>
  );
};
