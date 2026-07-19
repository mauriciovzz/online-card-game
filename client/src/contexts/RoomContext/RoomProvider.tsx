import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router";

import { GAME_COLORS, RESPONSE_METADATA } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { RoomContext } from "./RoomContext";
import { useNotification, useRoomErrorHandler } from "@/hooks";
import { Spinner } from "@/components";

import type {
  EmptyResponse,
  NotificationInfo,
  Room,
  SocketRes,
  FinishedGameInfo,
} from "@shared/types";

type RoomView = "lobby" | "game";

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { socketRef, socketId } = useSocket();

  const [roomView, setRoomView] = useState<RoomView>("lobby");

  const [room, setRoom] = useState<Room | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [stgOpened, setStgOpened] = useState(false);

  const [winner, setWinner] = useState<NotificationInfo | null>(null);

  const { successNoti, errorNoti, quitNoti, resetNoti } = useNotification();
  const handleError = useRoomErrorHandler();

  const isAdmin = useMemo(
    () => socketId === room?.adminId,
    [socketId, room?.adminId],
  );

  const clientColor = useMemo(() => {
    const client = room?.players.find((p) => p.id === socketId);

    if (!client) return "black";

    return GAME_COLORS[client.pos - 1].hex;
  }, [room?.players, socketId]);

  const handleNewData = useCallback((newData: Room) => {
    setRoom(newData);
  }, []);

  const handleScoresReset = useCallback(
    (room: Room) => {
      resetNoti(RESPONSE_METADATA.SCORES_RESET);
      setRoom(room);
    },
    [resetNoti],
  );

  const handleGameStarted = useCallback(() => {
    setRoomView("game");
  }, []);

  const handleGameEnded = useCallback(
    (result: FinishedGameInfo) => {
      setStgOpened(false);

      if (result.winner) {
        setWinner(result.winner);
        return;
      }

      if (result.playerThatLeft) {
        quitNoti(result.playerThatLeft);
      } else {
        errorNoti("room.notification.cancelled");
      }

      setStgOpened(false);
      setRoomView("lobby");
    },
    [errorNoti, quitNoti],
  );

  const clearWinner = useCallback(() => {
    setWinner(null);
    setRoomView("lobby");
  }, []);

  const handleKickedOut = useCallback(() => {
    errorNoti(RESPONSE_METADATA.KICKED_OUT);
    void navigate("/", { replace: true });
  }, [errorNoti, navigate]);

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.emit("room:getData", { roomId }, (res: SocketRes<Room>) => {
      if (res.success) {
        setRoom(res.data);
        setIsReady(true);
      } else {
        handleError(res.error);
      }
    });

    socket.on("room:currentData", handleNewData);
    socket.on("room:scoresReset", handleScoresReset);
    socket.on("room:gameStarted", handleGameStarted);
    socket.on("room:gameEnded", handleGameEnded);
    socket.on("room:kickedOut", handleKickedOut);
    socket.on("room:error", handleError);
    return () => {
      socket.off("room:currentData", handleNewData);
      socket.on("room:scoresReset", handleScoresReset);
      socket.off("room:gameStarted", handleGameStarted);
      socket.off("room:gameEnded", handleGameEnded);
      socket.off("room:kickedOut", handleKickedOut);
      socket.off("room:error", handleError);
    };
  }, [
    socketRef,
    roomId,
    handleNewData,
    handleGameStarted,
    handleGameEnded,
    handleKickedOut,
    handleError,
    handleScoresReset,
  ]);

  const startGame = useCallback(() => {
    socketRef.current?.emit(
      "room:startGame",
      (res: SocketRes<EmptyResponse>) => {
        if (res.success) {
          handleGameStarted();
        } else {
          handleError(res.error);
        }
      },
    );
  }, [socketRef, handleGameStarted, handleError]);

  const leaveRoom = useCallback(() => {
    successNoti("room.notification.left");

    socketRef.current?.emit("room:leave");
    void navigate("/", { replace: true });
  }, [socketRef, successNoti, navigate]);

  const stopGame = useCallback(() => {
    socketRef.current?.emit(
      "room:stopGame",
      (res: SocketRes<EmptyResponse>) => {
        if (!res.success) {
          handleError(res.error);
        }
      },
    );
  }, [handleError, socketRef]);

  const openSettings = useCallback(() => {
    setStgOpened(true);
  }, []);

  const closeSettings = useCallback(() => {
    setStgOpened(false);
  }, []);

  const resetScores = useCallback(() => {
    socketRef.current?.emit("room:resetScores", (res: SocketRes<Room>) => {
      if (res.success) {
        handleScoresReset(res.data);
      } else {
        handleError(res.error);
      }
    });
  }, [socketRef, handleScoresReset, handleError]);

  // handle browser return
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", leaveRoom);

    return () => {
      window.removeEventListener("popstate", leaveRoom);
    };
  }, [navigate, leaveRoom]);

  if (!room || !isReady || !socketId) {
    return <Spinner />;
  }

  return (
    <RoomContext.Provider
      value={{
        roomView,

        room,
        isAdmin,
        resetScores,
        clientColor,

        winner,
        clearWinner,

        startGame,
        stopGame,
        leaveRoom,

        settingsOpened: stgOpened,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
