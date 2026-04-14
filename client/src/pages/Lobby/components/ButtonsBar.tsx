import {
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconX,
  IconSettings,
} from "@tabler/icons-react";

import { useSocket } from "@/contexts/SocketContext";
import {
  AppActionIcon,
  AppButton,
  ChatButton,
} from "@/components";

import type { Room, View } from "@/types";

interface Props {
  room: Room;
  view: View;
  setView: Dispatch<SetStateAction<View>>;
}

export const ButtonsBar = ({
  room,
  view,
  setView,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { socket } = useSocket();
  const isAdmin = socket?.id === room.adminId;

  const leaveLobby = useCallback(() => {
    if (!socket) return;

    socket.emit("room:leave", { roomId: room.id });
    void navigate("/");
  }, [socket, room.id, navigate]);

  const startGame = useCallback(() => {
    socket?.emit("room:startGame", { roomId: room.id });
  }, [socket, room.id]);

  const toggleEdit = useCallback(() => {
    setView((prevView) =>
      prevView === "edit" ? "lobby" : "edit"
    );
  }, [setView]);

  return (
    <Group gap="sm">
      <AppActionIcon
        icon={IconChevronLeft}
        expand={!isAdmin}
        onClick={leaveLobby}
      />

      {isAdmin && (
        <>
          <AppButton
            text={t("startGame")}
            expand
            disabled={room.players.length === 1}
            onClick={startGame}
          />

          <AppActionIcon
            icon={view === "edit" ? IconX : IconSettings}
            onClick={toggleEdit}
          />
        </>
      )}

      <ChatButton expand={!isAdmin} />
    </Group>
  );
};
