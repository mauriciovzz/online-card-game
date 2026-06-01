import { useCallback, useState } from "react";

import { ERRORS_MAP, MESSAGES_MAP } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";
import { useNotification } from "@/hooks";

import type {
  SocketRes,
  ResMessage,
  RoomCapacity,
  Room,
} from "@shared/types";

interface Props {
  room: Room;
}

export const useUpdateCapacity = ({ room }: Props) => {
  const { successNoti } = useNotification();
  const { socket } = useSocket();
  const { handleError } = useRoom();

  const [capacity, setCapacity] = useState(room.capacity);
  const [capacityError, setCapacityError] = useState("");

  const updateCapacity = useCallback(
    (capacity: RoomCapacity) => {
      socket?.emit(
        "room:updateCapacity",
        { capacity },
        (res: SocketRes<ResMessage>) => {
          if (res.success) {
            successNoti(MESSAGES_MAP[res.data.message]);
          } else {
            if (res.type === "VALIDATION") {
              const errorMsg = ERRORS_MAP[res.error];
              setCapacityError(errorMsg);
            } else {
              handleError(res.error);
            }
          }
        }
      );
    },
    [socket, successNoti, handleError]
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

  return {
    capacity,
    capacityError,
    onCapacityChange,
  };
};
