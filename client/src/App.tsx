import { Route, Routes } from "react-router";

import { RoomContextLayout } from "@/layouts";
import { HomePage, Lobby, Game } from "@/pages";

export const App = () => {
  return (
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
  );
};
