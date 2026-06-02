import { useCallback, useState } from "react";

import {
  ERROR_METADATA,
  RESPONSE_METADATA,
} from "@/constants";
import {
  useNotification,
  useRoomErrorHandler,
} from "@/hooks";
import { useSocket } from "@/contexts/SocketContext";

import { ERROR_CODES } from "@shared/constants/errorCodes";
import type {
  SocketRes,
  EmptyResponse,
  RoomCapacity,
  Room,
} from "@shared/types";

interface Props {
  room: Room;
}

export const useUpdateCapacity = ({ room }: Props) => {
  const { successNoti } = useNotification();
  const { socket } = useSocket();
  const handleError = useRoomErrorHandler();

  const [capacity, setCapacity] = useState(room.capacity);
  const [capacityError, setCapacityError] = useState("");

  const updateCapacity = useCallback(
    (capacity: RoomCapacity) => {
      socket?.emit(
        "room:updateCapacity",
        { capacity },
        (res: SocketRes<EmptyResponse>) => {
          if (res.success) {
            successNoti(RESPONSE_METADATA.CAPACITY_UPDATED);
          } else {
            switch (res.error) {
              case ERROR_CODES.CAPACITY_CONFLICT: {
                const meta = ERROR_METADATA[res.error];
                if (!meta.message) return;

                setCapacityError(meta.message);
                return;
              }

              default:
                handleError(res.error);
                return;
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
