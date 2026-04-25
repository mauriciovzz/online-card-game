import { useState, type ReactNode } from "react";
import { Stack } from "@mantine/core";

import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";
import {
  ButtonsBar,
  MainView,
  UpdateRoomView,
} from "./components";

import type { View } from "@/types";

export const Lobby = () => {
  const { socket } = useSocket();
  const { room } = useRoom();

  const [view, setView] = useState<View>("main");

  const viewComponents: Record<View, ReactNode> = {
    ["main"]: <MainView room={room} />,
    ["edit"]: (
      <UpdateRoomView
        room={room}
        close={() => setView("main")}
      />
    ),
  };

  if (!socket) return;

  return (
    <>
      <Stack h="100%" gap="sm">
        {viewComponents[view]}
      </Stack>

      <ButtonsBar
        view={view}
        setView={setView}
        canStartGame={room.players.length > 1}
      />
    </>
  );
};
