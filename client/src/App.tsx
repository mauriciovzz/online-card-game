import { Route, Routes } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";
import { Faq } from "./pages/Faq";
import { GameList } from "./pages/GameList";
import { GameRoom } from "./pages/GameRoom";
import { GameCreation } from "./pages/GameCreation";

export const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game-creation" element={<GameCreation />} />
        <Route path="/rooms" element={<GameList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/game-room/:id" element={<GameRoom />} />
      </Routes>
    </MainLayout>
  );
};
