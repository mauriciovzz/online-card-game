import { IconSettings } from "@tabler/icons-react";

import { AppActionIcon } from "./AppActionIcon";
import { useRoom } from "@/contexts/RoomContext";

export const SettingsButton = () => {
  const { openSettings } = useRoom();

  return (
    <AppActionIcon onClick={openSettings}>
      <IconSettings size={20} stroke={2} />
    </AppActionIcon>
  );
};
