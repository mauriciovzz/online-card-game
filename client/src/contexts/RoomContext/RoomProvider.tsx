import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router";

import { SpinnerLayout } from "@/layouts";
import { useSocket } from "@/contexts/SocketContext";
import { RoomContext } from "./RoomContext";

import type { Room, SocketRes, RoomId } from "@/types";
import { PLAYER_COLORS } from "@/constants";

export const RoomProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleNewInfo = useCallback(
    (res: SocketRes<Room>) => {
      if (res.success) {
        setRoom(res.data);
        setTimeout(() => {
          setIsReady(true);
        }, 500);
      }
    },
    []
  );

  const handleGameStarted = useCallback(
    (res: SocketRes<RoomId>) => {
      if (res.success) {
        void navigate(`/room/${res.data.roomId}/game`);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getInfo");

    socket.on("room:newInfo", handleNewInfo);
    socket.on("room:gameStarted", handleGameStarted);

    return () => {
      socket.off("room:newInfo", handleNewInfo);
      socket.off("room:gameStarted", handleGameStarted);
    };
  }, [handleGameStarted, handleNewInfo, roomId, socket]);

  const getPlayerColor = (playerId: string) => {
    const player = room?.players.find(
      (p) => p.id === playerId
    );

    return player
      ? PLAYER_COLORS[player.pos - 1]
      : undefined;
  };
  if (!isReady) {
    return <SpinnerLayout />;
  }

  if (!room) return;

  return (
    <RoomContext.Provider
      value={{
        room,
        getPlayerColor,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
