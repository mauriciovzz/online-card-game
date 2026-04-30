import { Route, Routes } from "react-router";
import { Notifications } from "@mantine/notifications";

import { RoomContextLayout } from "@/layouts";
import { useIsMobile } from "./hooks/useIsMobile";
import { HomePage, Lobby, Game } from "@/pages";

export const App = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Notifications
        position="bottom-center"
        containerWidth={isMobile ? "100%" : 335}
        notificationMaxHeight={isMobile ? 42 : 36}
        autoClose={2500}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<RoomContextLayout />}>
          <Route
            path="/room/:roomId/lobby"
            element={<Lobby />}
          />
          <Route
            path="/room/:roomId/game"
            element={<Game />}
          />
        </Route>
      </Routes>
    </>
  );
};
