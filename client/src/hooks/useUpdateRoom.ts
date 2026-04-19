import { useSocket } from "@/contexts/SocketContext";

import type {
  RoomCapacity,
  UpdateRoomProps,
} from "@/types";

export const useUpdateRoom = () => {
  const { socket } = useSocket();

  // useEffect(() => {
  //   if (!socket) return;

  //   const handleUpdate = (res: SocketRes<RoomId>) => {
  //     if (res.success) {
  //       onSuccess();
  //     } else {
  //       onFormError(res.error);
  //     }
  //   };

  //   socket.on("room:updateRes", handleUpdate);

  //   return () => {
  //     socket.off("room:updateRes", handleUpdate);
  //   };
  // }, [onFormError, onSuccess, socket]);

  const handleSubmit = (newData: UpdateRoomProps) => {
    socket?.emit("room:update", newData);
  };

  const handleUpdateCapacity = (capacity: RoomCapacity) => {
    socket?.emit("room:updateCapacity", { capacity });
  };

  const handlePlayerKick = (playerId: string) => {
    socket?.emit("room:kickPlayer", { playerId });
  };

  return {
    handleSubmit,
    handleUpdateCapacity,
    handlePlayerKick,
  };
};
