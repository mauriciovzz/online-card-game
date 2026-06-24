import { useState } from "react";
import { Group } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons-react";

import { MainLayout } from "@/layouts";
import {
  ThemeToggler,
  AppButton,
  LangToggler,
  AppActionIcon,
  DeactivatableBox,
  AppTitle,
} from "@/components";
import {
  CreateRoomForm,
  RoomList,
  UserNameInput,
} from "./components";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const [view, toggleView] = useToggle(["list", "create"]);
  const [nameEditable, setNameEditable] = useState(false);

  const navigate = useNavigate();

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

        <AppActionIcon
          onClick={() => void navigate("/game-test")}
        >
          <IconQuestionMark size={20} stroke={2} />
        </AppActionIcon>

        <LangToggler />

        <ThemeToggler />
      </Group>
    </MainLayout>
  );
};
