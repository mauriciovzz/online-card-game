import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home";
import { Settings } from "../pages/Settings";
import { Faq } from "../pages/Faq";
import { Rooms } from "../pages/Rooms";
import { GameRoom } from "../pages/GameRoom";
import { MainLayout } from "../layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/settings", element: <Settings /> },
      { path: "/faq", element: <Faq /> },
      { path: "/rooms", element: <Rooms /> },
      { path: "/rooms", element: <GameRoom /> },
    ],
  },
]);
