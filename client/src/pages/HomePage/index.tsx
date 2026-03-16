import { useState } from "react";
import { Group, Title } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useTranslation } from "react-i18next";

import { PageLayout } from "@/layouts";
import {
  ColorSchemeButton,
  CustomButton,
  LanguageButton,
} from "@/components";
import {
  CreateMatch,
  RoomList,
  UserNameInput,
} from "./components";

export const HomePage = () => {
  const { t } = useTranslation();

  const [isNameEditable, setIsNameEditable] =
    useState(false);
  const [value, toggle] = useToggle(["list", "create"]);
  const isList = value === "list";

  return (
    <PageLayout>
      <Title>Uno Online</Title>

      <UserNameInput
        isEditable={isNameEditable}
        setIsEditable={setIsNameEditable}
      />

      <CustomButton
        text={isList ? t("createMatch") : t("joinMatch")}
        disabled={isNameEditable}
        onClick={toggle}
      />

      {isList ? (
        <RoomList disabled={isNameEditable} />
      ) : (
        <CreateMatch disabled={isNameEditable} />
      )}

      <Group gap="sm" w="100%">
        <CustomButton
          text={t("rules")}
          expand
          disabled={isNameEditable}
          onClick={() => {
            console.log("hey");
          }}
        />

        <LanguageButton />

        <ColorSchemeButton />
      </Group>
    </PageLayout>
  );
};
