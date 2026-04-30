import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router";

import { SpinnerLayout } from "@/layouts";
import { useSocket } from "@/contexts/SocketContext";
import { useNotification } from "@/hooks";
import { PLAYER_SLOTS } from "@/constants";
import { RoomContext } from "./RoomContext";

import type {
  Room,
  RoomId,
  SocketRes,
  ErrorResponse,
} from "@shared/types";

const ERROR_MAP: Record<string, string> = {
  ROOM_NOT_FOUND: "errors.room.notFound",
  NOT_ENOUGHT_PLAYERS: "errors.room.notEnoughtPlayers",
  NOT_IN_ROOM: "errors.roon.notInRoom",
  SERVER_ERROR: "errors.roon.serverError",
};

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

  const { errorNoti } = useNotification();

  const handleRoomExit = useCallback(() => {
    void navigate("/");
  }, [navigate]);

  const handleNewData = useCallback((newData: Room) => {
    console.log(newData);
    setRoom(newData);
  }, []);

  const handleKickedOut = useCallback(() => {
    errorNoti("room.notification.kickedOut");
    handleRoomExit();
  }, [handleRoomExit, errorNoti]);

  const handleGameStarted = useCallback(
    ({ roomId }: RoomId) => {
      void navigate(`/room/${roomId}/game`);
    },
    [navigate]
  );

  const handleError = useCallback(
    (res: ErrorResponse) => {
      switch (res.error) {
        case "ROOM_NOT_FOUND":
        case "NOT_IN_ROOM":
        case "SERVER_ERROR":
          errorNoti(ERROR_MAP[res.error]);
          handleRoomExit();
          return;
        case "NOT_ENOUGHT_PLAYERS":
          errorNoti(ERROR_MAP[res.error]);
          return;
      }
    },
    [handleRoomExit, errorNoti]
  );

  useEffect(() => {
    console.log("RoomProvider mounted");
    return () => console.log("RoomProvider unmounted");
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getData", (res: SocketRes<Room>) => {
      if (res.success) {
        setRoom(res.data);
        setIsReady(true);
      } else {
        handleError(res);
      }
    });

    socket.on("room:currentData", handleNewData);
    socket.on("room:gameStarted", handleGameStarted);
    socket.on("room:kickedOut", handleKickedOut);
    socket.on("room:error", handleError);

    return () => {
      socket.off("room:currentData", handleNewData);
      socket.off("room:gameStarted", handleGameStarted);
      socket.off("room:kickedOut", handleKickedOut);
      socket.off("room:error", handleError);
    };
  }, [
    socket,
    roomId,
    handleNewData,
    handleGameStarted,
    handleKickedOut,
    handleError,
  ]);

  const isAdmin = useMemo(
    () => socket?.id === room?.adminId,
    [socket, room]
  );

  const leaveRoom = useCallback(() => {
    if (!socket || !room) return;

    socket.emit("room:leave", { roomId: room.id });
    handleRoomExit();
  }, [socket, room, handleRoomExit]);

  const startGame = useCallback(() => {
    if (!socket || !room) return;

    socket.emit(
      "room:startGame",
      (res: SocketRes<null>) => {
        if (!res.success) {
          handleError(res);
        }
      }
    );
  }, [socket, room, handleError]);

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
        handleError,
        getPlayerColor,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
