import { useCallback, useState } from "react";
import { Stack } from "@mantine/core";

import { useSocket } from "@/contexts/SocketContext";
import { useNotification } from "@/hooks";
import { Label, RoomPlayers } from "@/components";

import type { Room, SocketRes } from "@/types";

const ERROR_MAP: Record<string, string> = {
  PLAYER_NOT_FOUND: "errors.room.playerNotFound",
  NOT_ADMIN: "errors.room.notAdmin",
};

interface Props {
  room: Room;
}

export const EditableRoomPlayers = ({ room }: Props) => {
  const [kickError, setKickError] = useState("");

  const { socket } = useSocket();
  const { successNoti, errorNoti } = useNotification();

  const kickPlayerOut = useCallback(
    (playerId: string) => {
      socket?.emit(
        "room:kickPlayer",
        { playerId },
        (res: SocketRes<null>) => {
          if (res.success) {
            successNoti("room.notification.userKickedOut");
          } else {
            const error = res.error;

            if (error === "NOT_ADMIN") {
              errorNoti(ERROR_MAP[error]);
            } else {
              setKickError(ERROR_MAP[error]);
            }
          }
        }
      );
    },
    [socket, successNoti, errorNoti, setKickError]
  );

  return (
    <Stack gap={0} w="100%">
      <Label
        size="sm"
        text={"room.members"}
        error={kickError}
      />
      <RoomPlayers
        room={room}
        isEditable
        onKick={kickPlayerOut}
      />
    </Stack>
  );
};
