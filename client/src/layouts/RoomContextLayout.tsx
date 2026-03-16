import { Outlet } from "react-router";

import { RoomProvider } from "@/contexts/RoomContext";

export const RoomContextLayout = () => {
  return (
    <RoomProvider>
      <Outlet />
    </RoomProvider>
  );
};
