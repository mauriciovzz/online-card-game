import { Outlet } from "react-router";

import { RoomProvider } from "@/contexts/RoomContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { Chat, RoomSettingsModal } from "@/components";

export const RoomContextLayout = () => (
  <RoomProvider>
    <ChatProvider>
      <Outlet />

      <Chat />
      <RoomSettingsModal />
    </ChatProvider>
  </RoomProvider>
);
