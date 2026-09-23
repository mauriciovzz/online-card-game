import { Route, Routes, Navigate } from "react-router";

import { RoomContextLayout } from "./layouts";
import { HomePage, Room } from "@/pages";

export const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />

    <Route element={<RoomContextLayout />}>
      <Route path="/room/:roomId" element={<Room />} />
    </Route>

    <Route path="/*" element={<Navigate to="/" replace />} />
  </Routes>
);
