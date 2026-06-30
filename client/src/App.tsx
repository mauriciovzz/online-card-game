import { Route, Routes, Navigate } from "react-router";
import { Notifications } from "@mantine/notifications";

import { useIsMobile } from "./hooks/useIsMobile";
import { HomePage, Room } from "@/pages";
import { RoomContextLayout } from "./layouts";

export const App = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Notifications
        position="top-center"
        containerWidth={isMobile ? "100%" : 335}
        notificationMaxHeight={44.19}
        pauseResetOnHover="notification"
        styles={{ notification: { shadow: "none" } }}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<RoomContextLayout />}>
          <Route path="/room/:roomId" element={<Room />} />
        </Route>

        <Route
          path="/*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
};
