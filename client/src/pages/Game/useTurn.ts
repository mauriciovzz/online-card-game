import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";

import type { SocketRes, Turn } from "@shared/types";

export const useGame = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { handleError } = useRoom();

  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const [turn, setTurn] = useState<Turn | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleNewData = useCallback((newData: Turn) => {
    setTurn(newData);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("game:getData", (res: SocketRes<Turn>) => {
      if (res.success) {
        setTurn(res.data);
        setIsReady(true);
      } else {
        handleError(res);
      }
    });

    socket.on("game:currentData", handleNewData);

    return () => {
      socket.off("game:currentData", handleNewData);
    };
  }, [socket, roomId, handleNewData, handleError]);

  return { isTurnReady: isReady, turn, countdown };
};
