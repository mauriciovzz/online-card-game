import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import { useSocket } from "@/contexts/SocketContext";

import type { Turn } from "@shared/types";

export const useTurn = () => {
  const { roomId } = useParams();
  const { socketRef, socketId } = useSocket();

  const [turn, setTurn] = useState<Turn | null>(null);
  const [myTurn, setMyTurn] = useState(false);

  const handleNewTurn = useCallback(
    (newTurn: Turn) => {
      setTurn(newTurn);
      setMyTurn(newTurn.currentPlayerId === socketId);
    },
    [socketId],
  );

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on("game:newTurn", handleNewTurn);

    return () => {
      socket.off("game:newTurn", handleNewTurn);
    };
  }, [socketRef, roomId, handleNewTurn]);

  return { turn, myTurn };
};
