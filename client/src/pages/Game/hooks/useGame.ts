import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useRoom } from "@/contexts/RoomContext";
import { useNotification } from "@/hooks";

import type {
  SocketRes,
  GameState,
  InitialGameData,
  HandState,
  PlayedCard,
  PlayerId,
  NotificationInfo,
  PlayerQuit,
  CutInfo,
  TimeoutRes,
  EffectInfo,
  EmptyRes,
} from "@shared/types";
import type { Items } from "@/types";

export const useGame = () => {
  const { roomId } = useParams();
  const {
    cutNoti,
    cuttedNoti,
    unoNoti,
    quitNoti,
    timeoutNoti,
    effectNoti,
  } = useNotification();
  const { socket } = useSocket();
  const { handleError } = useRoom();

  const [game, setGame] = useState<GameState | null>(null);

  const [items, setItems] = useState<Items>({
    cards: [],
    pile: [],
  });

  const [uno, setUno] = useState<boolean | null>(false);

  const handleNewData = useCallback(
    (newData: GameState) => {
      setGame(newData);
      setItems((prev) => {
        return {
          ...prev,
          pile: [newData.topCard],
        };
      });
    },
    []
  );

  const handleNewHand = useCallback(
    (newData: HandState) => {
      const { cards, calledUno } = newData;

      setItems((prev) => {
        const prevIds = prev.cards.map((c) => c.id);

        const filtered = cards.filter(
          (c) => !prevIds.includes(c.id)
        );

        return {
          ...prev,
          cards: [...prev.cards, ...filtered],
        };
      });

      setUno(calledUno);
    },
    []
  );

  const handleGotCut = useCallback(
    (data: CutInfo) => {
      const id = socket?.id;
      if (!id) return;
      cuttedNoti(id, data);
    },
    [cuttedNoti, socket]
  );

  const handleUnoCalled = useCallback(
    (data: NotificationInfo) => {
      unoNoti(false, data);
    },
    [unoNoti]
  );

  const handlePlayerQuit = useCallback(
    ({ name, gameState }: PlayerQuit) => {
      quitNoti(name);
      setGame(gameState);
    },
    [quitNoti]
  );

  const handleTimeout = useCallback(
    ({ hadToDraw }: TimeoutRes) => {
      timeoutNoti(hadToDraw);
    },
    [timeoutNoti]
  );

  const handleEffect = useCallback(
    (res: EffectInfo) => {
      effectNoti(res);
    },
    [effectNoti]
  );

  useEffect(() => {
    if (!socket) return;

    socket.emit(
      "game:getData",
      (res: SocketRes<InitialGameData>) => {
        if (res.success) {
          const { gameState, cards } = res.data;

          handleNewHand({ cards, calledUno: false });
          handleNewData(gameState);
        } else {
          handleError(res.error);
        }
      }
    );

    socket.on("game:currentData", handleNewData);
    socket.on("game:hand", handleNewHand);
    socket.on("game:gotCut", handleGotCut);
    socket.on("game:unoCalled", handleUnoCalled);
    socket.on("game:playerQuit", handlePlayerQuit);
    socket.on("game:timeout", handleTimeout);
    socket.on("game:effect", handleEffect);
    return () => {
      socket.off("game:currentData", handleNewData);
      socket.off("game:hand", handleNewHand);
      socket.off("game:gotCut", handleGotCut);
      socket.off("game:unoCalled", handleUnoCalled);
      socket.off("game:playerQuit", handlePlayerQuit);
      socket.off("game:timeout", handleTimeout);
      socket.off("game:effect", handleEffect);
    };
  }, [
    socket,
    roomId,
    handleNewData,
    handleNewHand,
    handleError,
    handleGotCut,
    handleUnoCalled,
    handlePlayerQuit,
    handleTimeout,
    handleEffect,
  ]);

  const playCard = useCallback(
    (playedCard: PlayedCard) => {
      socket?.emit(
        "game:playCard",
        playedCard,
        (res: SocketRes<EmptyRes>) => {
          if (!res.success) {
            handleError(res.error);
          }
        }
      );
    },
    [handleError, socket]
  );

  const drawCard = useCallback(() => {
    socket?.emit(
      "game:drawCard",
      (res: SocketRes<HandState>) => {
        if (res.success) {
          handleNewHand(res.data);
        } else {
          handleError(res.error);
        }
      }
    );
  }, [handleError, handleNewHand, socket]);

  const endTurn = useCallback(() => {
    socket?.emit(
      "game:endTurn",
      (res: SocketRes<EmptyRes>) => {
        if (!res.success) {
          handleError(res.error);
        }
      }
    );
  }, [handleError, socket]);

  const endStack = useCallback(() => {
    socket?.emit(
      "game:endStack",
      (res: SocketRes<HandState | null>) => {
        if (res.success) {
          if (!res.data) return;
          handleNewHand(res.data);
        } else {
          handleError(res.error);
        }
      }
    );
  }, [handleError, handleNewHand, socket]);

  const callUno = useCallback(() => {
    socket?.emit(
      "game:unoCall",
      (res: SocketRes<NotificationInfo>) => {
        if (res.success) {
          unoNoti(true, res.data);
          setUno(true);
        } else {
          handleError(res.error);
        }
      }
    );
  }, [handleError, socket, unoNoti]);

  const callCut = useCallback(
    (data: PlayerId) => {
      socket?.emit(
        "game:cutCall",
        data,
        (res: SocketRes<NotificationInfo>) => {
          if (res.success) {
            cutNoti(res.data);
          } else {
            handleError(res.error);
          }
        }
      );
    },
    [cutNoti, handleError, socket]
  );

  return {
    game,

    items,
    setItems,

    uno,

    funcs: {
      playCard,
      drawCard,
      endTurn,
      endStack,
      callUno,
      callCut,
    },
  };
};
