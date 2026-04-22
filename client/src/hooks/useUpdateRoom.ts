import { useSocket } from "@/contexts/SocketContext";

import type {
  ErrorResponse,
  RoomCapacity,
  SocketRes,
  UpdateRoomProps,
} from "@/types";

interface Props {
  onSuccess: () => void;
  onFormError: (errorMsg: string) => void;
  onCapacityError: (errorMsg: string) => void;
  onKickError: (errorMsg: string) => void;
}

export const useUpdateRoom = ({
  onSuccess,
  onFormError,
  onCapacityError,
  onKickError,
}: Props) => {
  const { socket } = useSocket();

  const updateRoom = (newData: UpdateRoomProps) => {
    socket?.emit(
      "room:update",
      newData,
      (res: SocketRes<null>) => {
        if (res.success) {
          onSuccess();
        } else {
          onFormError(res.error);
        }
      }
    );
  };

  const updateCapacity = (capacity: RoomCapacity) => {
    socket?.emit(
      "room:updateCapacity",
      { capacity },
      (res: ErrorResponse) => {
        onCapacityError(res.error);
      }
    );
  };

  const kickPlayerOut = (playerId: string) => {
    socket?.emit(
      "room:kickPlayer",
      { playerId },
      (res: ErrorResponse) => {
        onKickError(res.error);
      }
    );
  };

  return {
    updateRoom,
    updateCapacity,
    kickPlayerOut,
  };
};
