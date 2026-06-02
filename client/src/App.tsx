import { Route, Routes } from "react-router";
import { Notifications } from "@mantine/notifications";

import { RoomContextLayout } from "@/layouts";
import { useIsMobile } from "./hooks/useIsMobile";
import { HomePage, Lobby, Game, GameTest } from "@/pages";

export const App = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Notifications
        position="bottom-center"
        containerWidth={isMobile ? "100%" : 335}
        notificationMaxHeight={isMobile ? 42 : 36}
        pauseResetOnHover="notification"
        limit={1}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game-test" element={<GameTest />} />
        <Route element={<RoomContextLayout />}>
          <Route
            path="/lobby/:roomId"
            element={<Lobby />}
          />
          <Route path="/game/:roomId" element={<Game />} />
        </Route>
      </Routes>
    </>
  );
};
