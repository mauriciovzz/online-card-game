import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import { useNotification, useRoomErrorHandler } from "@/hooks";

import { ERROR_CODES } from "@shared/constants";
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
  EmptyResponse,
  Card,
} from "@shared/types";
import type { Items } from "@/types";

type Move = Card & PlayedCard;

export const useGame = () => {
  const { roomId } = useParams();
  const { cutNoti, cuttedNoti, unoNoti, quitNoti, timeoutNoti, effectNoti } =
    useNotification();
  const { socketRef, socketId } = useSocket();
  const handleError = useRoomErrorHandler();

  const [game, setGame] = useState<GameState | null>(null);

  const [items, setItems] = useState<Items>({ cards: [], pile: [] });

  const [uno, setUno] = useState<boolean | null>(false);

  const pendingCardRef = useRef<Card | null>(null);
  const queuedCardsRef = useRef<Card[]>([]);
  const awaitingRollbackRef = useRef(false);

  const handleNewData = useCallback((newData: GameState) => {
    setGame(newData);
    setItems((prev) => {
      return { ...prev, pile: [newData.topCard] };
    });
  }, []);

  const handleNewHand = useCallback((newData: HandState) => {
    const { cards, calledUno } = newData;

    if (pendingCardRef.current) {
      queuedCardsRef.current.push(...cards);
      return;
    }

    setItems((prev) => {
      const prevIds = prev.cards.map((c) => c.id);

      const filtered = cards.filter((c) => !prevIds.includes(c.id));

      if (pendingCardRef.current && awaitingRollbackRef.current) {
        queuedCardsRef.current.push(...filtered);

        return prev;
      }

      return { ...prev, cards: [...prev.cards, ...filtered] };
    });

    setUno(calledUno);
  }, []);

  const handleGotCut = useCallback(
    (data: CutInfo) => {
      const id = socketId;
      if (!id) return;
      cuttedNoti(id, data);
    },
    [cuttedNoti, socketId],
  );

  const handleUnoCalled = useCallback(
    (data: NotificationInfo) => {
      unoNoti(false, data);
    },
    [unoNoti],
  );

  const handlePlayerQuit = useCallback(
    ({ name, gameState }: PlayerQuit) => {
      quitNoti(name);
      setGame(gameState);
    },
    [quitNoti],
  );

  const handleTimeout = useCallback(
    ({ hadToDraw }: TimeoutRes) => {
      if (pendingCardRef.current) {
        awaitingRollbackRef.current = true;
      }

      timeoutNoti(hadToDraw);
    },
    [timeoutNoti],
  );

  const handleEffect = useCallback(
    (res: EffectInfo) => {
      effectNoti(res);
    },
    [effectNoti],
  );

  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.emit("game:getData", (res: SocketRes<InitialGameData>) => {
      if (res.success) {
        const { gameState, cards } = res.data;

        handleNewHand({ cards, calledUno: false });
        handleNewData(gameState);
      } else {
        handleError(res.error);
      }
    });

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
    socketRef,
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

  const rollbackCard = useCallback(() => {
    const card = pendingCardRef.current;
    if (!card) return;

    const queuedCards = queuedCardsRef.current;

    setItems((prev) => {
      const alreadyExists = prev.cards.some((c) => c.id === card.id);

      return {
        cards: alreadyExists
          ? [...prev.cards, ...queuedCards]
          : [...prev.cards, card, ...queuedCards],
        pile: prev.pile.filter((c) => c.id !== card.id),
      };
    });

    pendingCardRef.current = null;
    queuedCardsRef.current = [];
    awaitingRollbackRef.current = false;
  }, []);

  const playCard = useCallback(
    ({ cardId, chosenColor, ...card }: Move) => {
      pendingCardRef.current = card;

      socketRef.current?.emit(
        "game:playCard",
        { cardId, chosenColor },
        (res: SocketRes<EmptyResponse>) => {
          if (res.success) {
            pendingCardRef.current = null;
            queuedCardsRef.current = [];
            awaitingRollbackRef.current = false;
          } else {
            switch (res.error) {
              case ERROR_CODES.TURN_EXPIRED:
              case ERROR_CODES.NOT_YOUR_TURN: {
                rollbackCard();
                return;
              }
              default:
                handleError(res.error);
                return;
            }
          }
        },
      );
    },
    [handleError, rollbackCard, socketRef],
  );

  const drawCard = useCallback(() => {
    socketRef.current?.emit(
      "game:drawCard",
      (res: SocketRes<EmptyResponse>) => {
        if (!res.success) {
          handleError(res.error);
        }
      },
    );
  }, [handleError, socketRef]);

  const endTurn = useCallback(() => {
    socketRef.current?.emit("game:endTurn", (res: SocketRes<EmptyResponse>) => {
      if (!res.success) {
        handleError(res.error);
      }
    });
  }, [handleError, socketRef]);

  const endStack = useCallback(() => {
    socketRef.current?.emit(
      "game:endStack",
      (res: SocketRes<HandState | null>) => {
        if (!res.success) {
          handleError(res.error);
        }
      },
    );
  }, [handleError, socketRef]);

  const callUno = useCallback(() => {
    socketRef.current?.emit(
      "game:unoCall",
      (res: SocketRes<NotificationInfo>) => {
        if (res.success) {
          unoNoti(true, res.data);
          setUno(true);
        } else {
          handleError(res.error);
        }
      },
    );
  }, [handleError, socketRef, unoNoti]);

  const callCut = useCallback(
    (data: PlayerId) => {
      socketRef.current?.emit(
        "game:cutCall",
        data,
        (res: SocketRes<NotificationInfo>) => {
          if (res.success) {
            cutNoti(res.data);
          } else {
            handleError(res.error);
          }
        },
      );
    },
    [cutNoti, handleError, socketRef],
  );

  return {
    game,

    items,
    setItems,

    uno,

    pendingCardRef,
    rollbackCard,

    funcs: { playCard, drawCard, endTurn, endStack, callUno, callCut },
  };
};
