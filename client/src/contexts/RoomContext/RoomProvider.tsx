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
  EmptyResponse,
  Room,
  SocketRes,
  WinnerInfo,
} from "@shared/types";
type RoomView = "lobby" | "game";

export const RoomProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { socket } = useSocket();

  const [roomView, setRoomView] =
    useState<RoomView>("lobby");

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

  const handleGameStarted = useCallback(() => {
    setRoomView("game");
  }, []);

  const handleGameEndend = useCallback(
    ({ winner, playerThatLeft }: WinnerInfo) => {
      if (winner) {
        const clientWon = winner.id === socket?.id;
        winnerNoti(clientWon, winner, playerThatLeft);
      } else {
        errorNoti("room.notification.cancelled");
      }

      setStgOpened(false);
      setRoomView("lobby");
    },
    [errorNoti, socket?.id, winnerNoti]
  );

  const handleKickedOut = useCallback(() => {
    errorNoti(RESPONSE_METADATA.KICKED_OUT);
    void navigate("/", { replace: true });
  }, [errorNoti, navigate]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(
      "room:getData",
      { roomId },
      (res: SocketRes<Room>) => {
        if (res.success) {
          setRoom(res.data);
          setIsReady(true);
        } else {
          handleError(res.error);
        }
      }
    );

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

  const startGame = useCallback(() => {
    socket?.emit(
      "room:startGame",
      (res: SocketRes<EmptyResponse>) => {
        if (res.success) {
          handleGameStarted();
        } else {
          handleError(res.error);
        }
      }
    );
  }, [socket, handleGameStarted, handleError]);

  const leaveRoom = useCallback(() => {
    successNoti("room.notification.left");

    socket?.emit("room:leave");
    void navigate("/", { replace: true });
  }, [socket, successNoti, navigate]);

  const stopGame = useCallback(() => {
    socket?.emit(
      "room:stopGame",
      (res: SocketRes<EmptyResponse>) => {
        if (!res.success) {
          handleError(res.error);
        }
      }
    );
  }, [handleError, socket]);

  const openSettings = useCallback(() => {
    setStgOpened(true);
  }, []);

  const closeSettings = useCallback(() => {
    setStgOpened(false);
  }, []);

  // handle browser return
  useEffect(() => {
    window.history.pushState(
      null,
      "",
      window.location.href
    );
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", leaveRoom);

    return () => {
      window.removeEventListener("popstate", leaveRoom);
    };
  }, [socket, navigate, leaveRoom]);

  if (!room || !isReady) {
    return <SpinnerLayout />;
  }

  return (
    <RoomContext.Provider
      value={{
        roomView,

        room,
        isAdmin,

        leaveRoom,
        stopGame,
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
