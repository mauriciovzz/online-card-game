import { useState } from "react";
import { Group } from "@mantine/core";
import { useToggle } from "@mantine/hooks";

import { MainLayout } from "@/layouts";
import {
  ThemeToggler,
  AppButton,
  LangToggler,
  DeactivatableBox,
  AppTitle,
  HelpModal,
  HelpButton,
} from "@/components";
import {
  CreateRoomForm,
  RoomList,
  UserNameInput,
} from "./components";

export const HomePage = () => {
  const [view, toggleView] = useToggle(["list", "create"]);
  const [nameEditable, setNameEditable] = useState(false);

  const [helpOpened, setHelpOpened] = useState(false);

  const isList = view === "list";

  return (
    <MainLayout>
      <AppTitle text="Uno Online" />

      <UserNameInput
        isEditable={nameEditable}
        setIsEditable={setNameEditable}
      />

      <DeactivatableBox disabled={nameEditable}>
        {isList ? <RoomList /> : <CreateRoomForm />}
      </DeactivatableBox>

      {/* HomeBar */}
      <Group gap="sm" w="100%">
        <AppButton
          expand
          text={isList ? "room.create" : "common.return"}
          onClick={toggleView}
          disabled={nameEditable}
        />

        <HelpButton onClick={() => setHelpOpened(true)} />

        <LangToggler />

        <ThemeToggler />
      </Group>

      <HelpModal
        opened={helpOpened}
        onClose={() => setHelpOpened(false)}
      />
    </MainLayout>
  );
};
