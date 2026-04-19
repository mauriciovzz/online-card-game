import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router";

import { PLAYER_SLOTS } from "@/constants";
import { SpinnerLayout } from "@/layouts";
import { useSocket } from "@/contexts/SocketContext";
import { RoomContext } from "./RoomContext";

import type {
  Room,
  SocketRes,
  RoomId,
  ErrorResponse,
} from "@/types";

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

  const handleLeave = useCallback(() => {
    void navigate("/");
  }, [navigate]);

  const handleGameStarted = useCallback(
    (res: SocketRes<RoomId>) => {
      if (res.success) {
        void navigate(`/room/${res.data.roomId}/game`);
      }
    },
    [navigate]
  );

  const handleError = useCallback(
    (res: ErrorResponse) => {
      switch (res.error) {
        case "ROOM_NOT_FOUND":
          handleLeave();
          return;
      }
    },
    [handleLeave]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getInfo");

    socket.on("room:newInfo", handleNewInfo);
    socket.on("room:leave", handleLeave);
    socket.on("room:gameStarted", handleGameStarted);
    socket.on("room:error", handleError);

    return () => {
      socket.off("room:newInfo", handleNewInfo);
      socket.off("room:leave", handleLeave);
      socket.off("room:gameStarted", handleGameStarted);
      socket.off("room:error", handleError);
    };
  }, [
    handleError,
    handleGameStarted,
    handleLeave,
    handleNewInfo,
    roomId,
    socket,
  ]);

  const isAdmin = useMemo(
    () => socket?.id === room?.adminId,
    [socket, room]
  );

  const leaveRoom = useCallback(() => {
    if (!socket || !room) return;

    socket.emit("room:leave", { roomId: room.id });
    void navigate("/");
  }, [socket, room, navigate]);

  const startGame = useCallback(() => {
    if (!socket || !room) return;

    socket.emit("room:startGame", { roomId: room.id });
  }, [socket, room]);

  const getPlayerColor = (playerId: string) => {
    const player = room?.players.find(
      (p) => p.id === playerId
    );

    return player
      ? PLAYER_SLOTS[player.pos - 1]
      : undefined;
  };

  if (!room || !isReady) {
    return <SpinnerLayout />;
  }

  return (
    <RoomContext.Provider
      value={{
        room,
        isAdmin,
        leaveRoom,
        startGame,
        getPlayerColor,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
