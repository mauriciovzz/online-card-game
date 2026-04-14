import { useState, type ReactNode } from "react";
import { Stack, Title } from "@mantine/core";

import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";
import {
  ButtonsBar,
  EditRoom,
  RoomSlots,
} from "./components";

import type { View } from "@/types";

export const Lobby = () => {
  const { socket } = useSocket();
  const { room } = useRoom();

  const [view, setView] = useState<View>("lobby");

  const viewComponents: Record<View, ReactNode> = {
    ["lobby"]: <RoomSlots room={room} />,
    ["edit"]: <EditRoom />,
  };

  if (!socket) return;

  return (
    <>
      <Title w="100%">{room.name}</Title>

      <Stack h="100%">{viewComponents[view]}</Stack>

      <ButtonsBar
        room={room}
        view={view}
        setView={setView}
      />
    </>
  );
};
