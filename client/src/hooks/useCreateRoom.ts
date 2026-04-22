import { useNavigate } from "react-router";

import { useSocket } from "@/contexts/SocketContext";

import type {
  CreateRoomProps,
  RoomId,
  SocketRes,
} from "@/types";

interface Props {
  onFormError: (errorMsg: string) => void;
}

export const useCreateRoom = ({ onFormError }: Props) => {
  const navigate = useNavigate();

  const { socket } = useSocket();

  const createRoom = (newRoom: CreateRoomProps) => {
    socket?.emit(
      "room:create",
      newRoom,
      (res: SocketRes<RoomId>) => {
        if (res.success) {
          void navigate(`/room/${res.data.roomId}/lobby`);
        } else {
          onFormError(res.error);
        }
      }
    );
  };

  return {
    createRoom,
  };
};
