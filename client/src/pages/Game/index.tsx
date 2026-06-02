import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Group } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

import { useRoom } from "@/contexts/RoomContext";
import { useGame, usePendingCard, useTurn } from "./hooks";
import { SpinnerLayout } from "@/layouts";
import {
  AppBox,
  AppTitle,
  InfoBox,
  SelectedRules,
} from "@/components";
import {
  GameBar,
  Hand,
  Pile,
  TurnIndicator,
  ColorPicker,
  PlayersCards,
} from "./components";

import moveHelper from "@shared/utils/moveHelper";
import type { Card } from "@shared/types";

type Cont = HTMLDivElement | null;
type IsValid = boolean | null;

export const Game = () => {
  const { ref, width } = useElementSize();

  const [container, setContainer] = useState<Cont>(null);
  const [validMove, setValidMove] = useState<IsValid>(null);

  const { room } = useRoom();
  const { game, items, setItems, uno, funcs } = useGame();
  const { turn, myTurn } = useTurn();

  const {
    pending,
    penId,
    handlePending,
    clearPending,
    pickColor,
  } = usePendingCard({
    playCard: funcs.playCard,
    setItems,
  });

  useEffect(() => {
    if (myTurn) return;
    setValidMove(null);
    clearPending();
  }, [myTurn, clearPending]);

  const currentPlayerName = useMemo(
    () =>
      game?.players.find(
        (player) => player.id === turn?.currentPlayerId
      )?.name,
    [game, turn]
  );

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const sourceData = event.operation.source?.data;
      const card = sourceData?.card as Card | undefined;

      const targetId = event.operation.target?.id;

      if (targetId === "pile" && myTurn) {
        if (!card || pending) return;

        const canPlayAgain =
          room.rules.stair || room.rules.mirror;

        let isValid = false;

        const topCard = items.pile[items.pile.length - 1];

        if (items.cards.length === 1) {
          isValid = card.type === "NUMBER";
        } else if (turn?.effect) {
          isValid = turn.effect === card.type;
        } else {
          if (turn?.cardPut && canPlayAgain) {
            isValid = moveHelper.checkChainMove(
              topCard,
              card,
              room.rules
            );
          } else {
            isValid = moveHelper.checkMove(topCard, card);
          }
        }

        setValidMove(isValid);

        return;
      }

      setItems((prev) => ({
        ...prev,
        cards: move(prev.cards, event),
      }));

      setValidMove(null);
    },
    [
      myTurn,
      setItems,
      pending,
      room.rules,
      items.pile,
      items.cards.length,
      turn?.effect,
      turn?.cardPut,
    ]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const sourceData = event.operation.source?.data;
      const card = sourceData?.card as Card | undefined;

      if (!myTurn || !validMove || !card) {
        setValidMove(null);
        return;
      }

      const isWild =
        card.type === "WILD_CARD" ||
        card.type === "DRAW_FOUR";

      if (isWild) {
        handlePending(card);
        setValidMove(null);
        return;
      }

      setItems((prev) => {
        const updated = move(prev, event);

        const index = updated.pile.findIndex(
          (item) => item.id === card.id
        );

        updated.pile.push(updated.pile.splice(index, 1)[0]);

        return updated;
      });

      setValidMove(null);

      setTimeout(() => {
        funcs.playCard({
          cardId: card.id,
        });
      }, 300);
    },
    [myTurn, validMove, setItems, handlePending, funcs]
  );

  if (!game || !turn) return <SpinnerLayout />;

  return (
    <>
      <div ref={ref} style={{ width: "100%" }} />

      {width > 0 && (
        <>
          <AppTitle text={room.name} />

          <Group gap="sm">
            <TurnIndicator
              player={
                myTurn ? undefined : currentPlayerName
              }
              turnDuration={room.turnDuration}
              startTime={turn.startTime}
            />

            <InfoBox
              info={<SelectedRules rules={room.rules} />}
            />
          </Group>

          <DragDropProvider
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <AppBox
              ref={setContainer}
              p="sm"
              pos="relative"
            >
              <PlayersCards
                data={{ room, game, turn }}
                cutCall={funcs.callCut}
              >
                <Pile
                  width={width - 102}
                  pile={items.pile}
                  pendingCard={pending}
                  validMove={validMove}
                  game={game}
                  container={container}
                />

                <Hand
                  width={width - 102}
                  cards={items.cards}
                  pendingCardId={penId}
                  container={container}
                />
              </PlayersCards>
            </AppBox>
          </DragDropProvider>

          {pending ? (
            <ColorPicker pick={pickColor} />
          ) : (
            <GameBar
              turn={turn}
              myTurn={myTurn}
              canCallUno={items.cards.length === 1 && !uno}
              stack={room.rules.stack}
              funcs={funcs}
            />
          )}
        </>
      )}
    </>
  );
};
