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
        containerWidth={isMobile ? undefined : 335}
        notificationMaxHeight={42}
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
