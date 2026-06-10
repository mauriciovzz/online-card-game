import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useParams } from "react-router";

import { useSocket } from "@/contexts/SocketContext";
import {
  useNotification,
  useRoomErrorHandler,
} from "@/hooks";

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
import { ERROR_CODES } from "@shared/constants/errorCodes";

type Move = Card & PlayedCard;

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
  const handleError = useRoomErrorHandler();

  const [game, setGame] = useState<GameState | null>(null);

  const [items, setItems] = useState<Items>({
    cards: [],
    pile: [],
  });

  const [uno, setUno] = useState<boolean | null>(false);

  const pendingCardRef = useRef<Card | null>(null);
  const queuedCardsRef = useRef<Card[]>([]);
  const awaitingRollbackRef = useRef(false);

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

      if (pendingCardRef.current) {
        queuedCardsRef.current.push(...cards);
        return;
      }

      setItems((prev) => {
        const prevIds = prev.cards.map((c) => c.id);

        const filtered = cards.filter(
          (c) => !prevIds.includes(c.id)
        );

        if (
          pendingCardRef.current &&
          awaitingRollbackRef.current
        ) {
          queuedCardsRef.current.push(...filtered);

          return prev;
        }

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
      if (pendingCardRef.current) {
        awaitingRollbackRef.current = true;
      }

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

  const rollbackCard = useCallback(() => {
    const card = pendingCardRef.current;
    if (!card) return;

    const queuedCards = queuedCardsRef.current;

    setItems((prev) => {
      const alreadyExists = prev.cards.some(
        (c) => c.id === card.id
      );

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

      socket?.emit(
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
        }
      );
    },
    [handleError, rollbackCard, socket]
  );

  const drawCard = useCallback(() => {
    socket?.emit(
      "game:drawCard",
      (res: SocketRes<EmptyResponse>) => {
        if (!res.success) {
          handleError(res.error);
        }
      }
    );
  }, [handleError, socket]);

  const endTurn = useCallback(() => {
    socket?.emit(
      "game:endTurn",
      (res: SocketRes<EmptyResponse>) => {
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
        if (!res.success) {
          handleError(res.error);
        }
      }
    );
  }, [handleError, socket]);

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

    pendingCardRef,
    rollbackCard,

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
