import { Route, Routes } from "react-router";
import { Home } from "./pages/Home/Home";
import { Rooms } from "./pages/Rooms";
import { Game } from "./pages/Game";
import { Lobby } from "./pages/Lobby/Lobby";
import { RoomContextLayout } from "./layouts/RoomContextLayout";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<Rooms />} />
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
