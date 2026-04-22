import { useState, type ReactNode } from "react";
import { Stack } from "@mantine/core";

import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";
import { useNotification } from "@/hooks/useNotfication";
import {
  ButtonsBar,
  EditRoom,
  RoomSlots,
} from "./components";

import type { View } from "@/types";

export const Lobby = () => {
  const { socket } = useSocket();
  const { room } = useRoom();

  const { onSuccess } = useNotification();

  const [view, setView] = useState<View>("lobby");

  const viewComponents: Record<View, ReactNode> = {
    ["lobby"]: <RoomSlots room={room} />,
    ["edit"]: (
      <EditRoom
        room={room}
        onSuccess={() => {
          onSuccess("room.notification.updated");
          setView("lobby");
        }}
      />
    ),
  };

  if (!socket) return;

  return (
    <>
      <Stack h="100%">{viewComponents[view]}</Stack>

      <ButtonsBar
        room={room}
        view={view}
        setView={setView}
      />
    </>
  );
};
