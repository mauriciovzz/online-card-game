import { Outlet, useOutletContext } from "react-router";

import { RoomProvider } from "@/contexts/RoomContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { Chat, RoomSettingsModal } from "@/components";

import type { MainLayoutContextType } from "@/types";

const useHeight = () => {
  return useOutletContext<MainLayoutContextType>();
};

export const RoomContextLayout = () => {
  const { layoutHeight } = useHeight();

  return (
    <RoomProvider>
      <ChatProvider>
        <Outlet />

        <Chat layoutHeight={layoutHeight} />
        <RoomSettingsModal />
      </ChatProvider>
    </RoomProvider>
  );
};
