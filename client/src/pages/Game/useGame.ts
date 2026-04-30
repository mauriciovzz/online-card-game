import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";

import type { SocketRes, GameState } from "@shared/types";

export const useGame = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { handleError } = useRoom();

  const [game, setGame] = useState<GameState | null>(null);
  const [hand, setHand] = useState<Card[]>(null);
  const [uno, setUno] = useState<boolean | null>(null);

  const [isReady, setIsReady] = useState(false);

  const handleNewData = useCallback(
    (newData: GameState) => {
      setGame(newData);
    },
    []
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit(
      "game:getData",
      (res: SocketRes<GameState>) => {
        if (res.success) {
          setGame(res.data);
          setIsReady(true);
        } else {
          handleError(res);
        }
      }
    );

    socket.on("game:currentData", handleNewData);

    return () => {
      socket.off("game:currentData", handleNewData);
    };
  }, [socket, roomId, handleNewData, handleError]);

  return { isReady, game, hand, uno };
};
