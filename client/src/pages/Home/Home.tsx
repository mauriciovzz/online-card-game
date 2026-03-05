import { Button, Stack, Group, Title } from "@mantine/core";
import { useNavigate } from "react-router";
import { PlayerNameInput } from "./PlayerNameInput";
import { useDisclosure } from "@mantine/hooks";
import { CreateRoomWindow } from "./CreateRoomWindow";
import { ColorSchemeButton } from "../../components/ColorSchemeButton";
import { LenguageButton } from "../../components/LenguageButton";
import { PageLayout } from "../../layouts/PageLayout";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useForm } from "@mantine/form";
import type { UserName } from "../../types/types";
import { useSocket } from "../../contexts/SocketContext";

export const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { userName } = useSocket();

  const [opened, handlers] = useDisclosure(false);
  const [isNameEditable, setIsNameEditable] =
    useState(false);

  const form = useForm<UserName>({
    mode: "uncontrolled",
    initialValues: {
      name: userName,
    },

    validate: {
      name: (value) => {
        if (value.length < 2) return t("NAME_MIN_LENGTH");
        if (value.length > 15) return t("NAME_MAX_LENGTH");
        return null;
      },
    },
  });

  const stopEditing = () => {
    setIsNameEditable(false);
    form.setFieldValue("name", userName);
  };

  return (
    <PageLayout>
      <Title>Uno Online</Title>

      <PlayerNameInput
        isEditable={isNameEditable}
        setIsEditable={setIsNameEditable}
        form={form}
        stopEditing={stopEditing}
      />

      <Stack h="100%" w="100%">
        <Stack h="100%">
          <Button
            bg="yellow"
            onClick={() => {
              stopEditing();
              handlers.open();
            }}
          >
            {t("createGame")}
          </Button>

          <Button
            bg="green"
            onClick={() => void navigate("/rooms")}
          >
            {t("joinGame")}
          </Button>
        </Stack>

        <Group gap="sm" w="100%">
          <Button
            flex={1}
            bg="blue"
            onClick={() => {
              stopEditing();
              handlers.open();
            }}
          >
            {t("rules")}
          </Button>
          <LenguageButton />
          <ColorSchemeButton />
        </Group>
      </Stack>

      <CreateRoomWindow
        opened={opened}
        onClose={handlers.close}
        onCreate={(roomId: string) =>
          void navigate(`/room/${roomId}/lobby`)
        }
      />
    </PageLayout>
  );
};
