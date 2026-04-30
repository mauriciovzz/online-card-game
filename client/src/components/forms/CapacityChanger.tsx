import { useCallback, useState } from "react";
import { SegmentedControl, Stack } from "@mantine/core";

import { useSocket } from "@/contexts/SocketContext";
import { ROOM_CAPACITY_OPTIONS } from "@/constants";
import { useIsMobile, useNotification } from "@/hooks";
import { Label } from "@/components";

import type {
  Room,
  RoomCapacity,
  SocketRes,
} from "@shared/types";

const ERROR_MAP: Record<string, string> = {
  CAPACITY_CONFLICT: "errors.room.capacityConflict",
  NOT_ADMIN: "errors.room.notAdmin",
};

interface Props {
  room: Room;
}

export const CapacityChanger = ({ room }: Props) => {
  const [capacity, setCapacity] = useState(room.capacity);
  const [capacityError, setCapacityError] = useState("");

  const { socket } = useSocket();
  const { successNoti, errorNoti } = useNotification();
  const isMobile = useIsMobile();

  const updateCapacity = useCallback(
    (capacity: RoomCapacity) => {
      socket?.emit(
        "room:updateCapacity",
        { capacity },
        (res: SocketRes<null>) => {
          if (res.success) {
            successNoti(
              "room.notification.capacityUpdated"
            );
          } else {
            const error = res.error;

            if (error === "NOT_ADMIN") {
              errorNoti(ERROR_MAP[error]);
            } else {
              setCapacityError(ERROR_MAP[error]);
            }
          }
        }
      );
    },
    [socket, successNoti, errorNoti, setCapacityError]
  );

  const onCapacityChange = useCallback(
    (value: RoomCapacity) => {
      setCapacityError("");

      if (Number(value) < room.players.length) {
        setCapacityError("errors.room.capacityConflict");
        return;
      }

      setCapacity(value);
      updateCapacity(value);
    },
    [room.players.length, updateCapacity]
  );

  return (
    <Stack gap={0} w="100%">
      <Label
        text={"room.numPlayers"}
        size="sm"
        error={capacityError}
      />
      <SegmentedControl
        size={isMobile ? "md" : "sm"}
        value={capacity}
        onChange={onCapacityChange}
        data={ROOM_CAPACITY_OPTIONS}
      />
    </Stack>
  );
};
