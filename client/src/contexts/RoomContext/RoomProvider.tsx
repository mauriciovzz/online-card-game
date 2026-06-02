import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router";

import { RESPONSE_METADATA } from "@/constants";
import { SpinnerLayout } from "@/layouts";
import { useSocket } from "@/contexts/SocketContext";
import {
  useNotification,
  useRoomErrorHandler,
} from "@/hooks";
import { RoomContext } from "./RoomContext";

import type {
  Room,
  RoomId,
  SocketRes,
  WinnerInfo,
} from "@shared/types";

export const RoomProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { socket } = useSocket();

  const [room, setRoom] = useState<Room | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [stgOpened, setStgOpened] = useState(false);

  const { successNoti, errorNoti, winnerNoti } =
    useNotification();
  const handleError = useRoomErrorHandler();

  const isAdmin = useMemo(
    () => socket?.id === room?.adminId,
    [socket, room]
  );

  const handleNewData = useCallback((newData: Room) => {
    setRoom(newData);
  }, []);

  const handleKickedOut = useCallback(() => {
    errorNoti(RESPONSE_METADATA.KICKED_OUT);
    void navigate("/");
  }, [errorNoti, navigate]);

  const handleGameStarted = useCallback(
    ({ roomId }: RoomId) => {
      void navigate(`/game/${roomId}`);
    },
    [navigate]
  );

  const handleGameEndend = useCallback(
    ({ roomId, winner, playerThatLeft }: WinnerInfo) => {
      if (!winner.id) return;

      const clientWon = winner.id === socket?.id;

      winnerNoti(clientWon, winner, playerThatLeft);
      void navigate(`/lobby/${roomId}`);
    },
    [navigate, socket?.id, winnerNoti]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit("room:getData", (res: SocketRes<Room>) => {
      if (res.success) {
        setRoom(res.data);
        setIsReady(true);
      } else {
        handleError(res.error);
      }
    });

    socket.on("room:currentData", handleNewData);
    socket.on("room:gameStarted", handleGameStarted);
    socket.on("room:gameEnded", handleGameEndend);
    socket.on("room:kickedOut", handleKickedOut);
    socket.on("room:error", handleError);
    return () => {
      socket.off("room:currentData", handleNewData);
      socket.off("room:gameStarted", handleGameStarted);
      socket.off("room:gameEnded", handleGameEndend);
      socket.off("room:kickedOut", handleKickedOut);
      socket.off("room:error", handleError);
    };
  }, [
    socket,
    roomId,
    handleNewData,
    handleGameStarted,
    handleGameEndend,
    handleKickedOut,
    handleError,
  ]);

  const leaveRoom = useCallback(() => {
    if (!socket || !room) return;

    socket.emit("room:leave", { roomId: room.id });
    successNoti("room.notification.left");
    void navigate("/");
  }, [socket, room, successNoti, navigate]);

  const startGame = useCallback(() => {
    if (!socket || !room) return;

    socket.emit(
      "room:startGame",
      (res: SocketRes<RoomId>) => {
        if (res.success) {
          handleGameStarted(res.data);
        } else {
          handleError(res.error);
        }
      }
    );
  }, [socket, room, handleGameStarted, handleError]);

  const openSettings = useCallback(() => {
    setStgOpened(true);
  }, []);

  const closeSettings = useCallback(() => {
    setStgOpened(false);
  }, []);

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

        settingsOpened: stgOpened,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
