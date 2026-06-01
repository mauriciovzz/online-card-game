import { useState } from "react";
import { Stack } from "@mantine/core";

import { useRoom } from "@/contexts/RoomContext";
import {
  ButtonsBar,
  Overview,
  UpdateRoom,
} from "./components";

import type { View } from "@/types";

export const Lobby = () => {
  const { room } = useRoom();

  const [view, setView] = useState<View>("main");

  return (
    <>
      <Stack h="100%" gap="sm">
        {view === "main" ? (
          <Overview room={room} />
        ) : (
          <UpdateRoom
            room={room}
            close={() => setView("main")}
          />
        )}
      </Stack>

      <ButtonsBar
        view={view}
        setView={setView}
        canStartGame={room.players.length > 1}
      />
    </>
  );
};
