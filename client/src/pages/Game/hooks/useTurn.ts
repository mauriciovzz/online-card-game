import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import { useSocket } from "@/contexts/SocketContext";

import type { Turn } from "@shared/types";

export const useTurn = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();

  const [turn, setTurn] = useState<Turn | null>(null);
  const [myTurn, setMyTurn] = useState(false);

  const handleNewTurn = useCallback(
    (newTurn: Turn) => {
      setTurn(newTurn);
      setMyTurn(newTurn.currentPlayerId === socket?.id);
    },
    [socket?.id]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("game:newTurn", handleNewTurn);

    return () => {
      socket.off("game:newTurn", handleNewTurn);
    };
  }, [socket, roomId, handleNewTurn]);

  return {
    turn,
    myTurn,
  };
};
