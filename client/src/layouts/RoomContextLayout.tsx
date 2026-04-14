import { Outlet } from "react-router";

import { RoomProvider } from "@/contexts/RoomContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { Chat } from "@/components";
import { MainLayout } from "./MainLayout";

export const RoomContextLayout = () => {
  return (
    <RoomProvider>
      <ChatProvider>
        <MainLayout>
          <Outlet />

          <Chat />
        </MainLayout>
      </ChatProvider>
    </RoomProvider>
  );
};
