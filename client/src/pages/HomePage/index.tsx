import { useState } from "react";
import { Group, Title } from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { IconQuestionMark } from "@tabler/icons-react";

import { MainLayout } from "@/layouts";
import {
  ThemeToggler,
  AppButton,
  LangToggler,
  AppActionIcon,
  DeactivatableBox,
} from "@/components";
import {
  CreateRoom,
  RoomList,
  UserNameInput,
} from "./components";
import { useNavigate } from "react-router";

export const HomePage = () => {
  const [view, toggleView] = useToggle(["list", "create"]);
  const [nameEditable, setNameEditable] = useState(false);

  const navigate = useNavigate();

  const isListView = view === "list";
  const buttonText = isListView
    ? "room.create"
    : "common.return";

  return (
    <MainLayout>
      <Title>Uno Online</Title>

      <UserNameInput
        isEditable={nameEditable}
        setIsEditable={setNameEditable}
      />

      <DeactivatableBox disabled={nameEditable}>
        {isListView ? <RoomList /> : <CreateRoom />}
      </DeactivatableBox>

      <Group gap="sm" w="100%">
        <AppButton
          expand
          text={buttonText}
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
