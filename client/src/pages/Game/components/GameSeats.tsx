import { memo, useMemo, type ReactNode } from "react";
import {
  Group,
  Divider,
  ActionIcon,
  Text,
  Stack,
  Flex,
  Image,
} from "@mantine/core";
import { IconCardsFilled, IconScissors } from "@tabler/icons-react";

import { GAME_COLORS } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useThemeColor } from "@/hooks";

import type { Room, GameState, PlayerId } from "@shared/types";
import { SeatBox } from "@/components";

const BOARD_PADDING = 38;

const LAYOUT = {
  cardsPerRow: 14,
  cardWidth: 20,
  cardHeight: 31.41,
  rowOffset: 10,
} as const;

type BoardPosition = "top" | "bottom" | "left" | "right";

const layout: BoardPosition[] = ["bottom", "left", "top", "right"];

const BOARD_POSITIONS = {
  bottom: { bottom: 12 },
  left: { left: -98, transform: "rotate(-90deg)" },
  top: { top: 12 },
  right: { right: -98, transform: "rotate(90deg)" },
} satisfies Record<BoardPosition, React.CSSProperties>;

const getBoardPosition = (
  clientPos: number,
  seatPos: number,
): BoardPosition => {
  return layout[(seatPos - clientPos + 4) % 4];
};

const OponnentHand = memo(
  ({ name, cards }: { name: string; cards: number }) => {
    const width = 225;

    const spacing = useMemo(() => {
      const totalCardWidth = cards * LAYOUT.cardWidth;
      const spacesBetweenCards = cards - 1;

      const spaceLeft = totalCardWidth - width;

      const spacing =
        totalCardWidth <= width ? 0 : spaceLeft / spacesBetweenCards;

      return spacing;
    }, [width, cards]);

    const handWidth =
      cards === 0
        ? 0
        : LAYOUT.cardWidth + (cards - 1) * (LAYOUT.cardWidth - spacing);

    const positionedCards = Array.from({ length: cards }, (_, index) => ({
      left: index * (LAYOUT.cardWidth - spacing),
    }));

    return (
      <Flex
        w="100%"
        justify="center"
        pos="absolute"
        style={{ top: 15, zIndex: -10 }}
      >
        <Flex w={width} h={LAYOUT.cardHeight} justify="center" align="center">
          <Flex pos="relative" w={handWidth} h={LAYOUT.cardHeight}>
            {positionedCards.map(({ left }, index) => {
              return (
                <Image
                  key={`${name}-${index.toString()}`}
                  h="auto"
                  w={LAYOUT.cardWidth}
                  fit="contain"
                  src="/back.png"
                  pos="absolute"
                  style={{ left }}
                />
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    );
  },
);

const GameSeat = memo(
  ({
    pos,
    color,
    name,
    cards,
    calledUno,
    isOponnent,
    cut,
    disableCut,
  }: {
    pos: BoardPosition;
    color: string;
    name: string;
    cards: number;
    calledUno: boolean;
    isOponnent: boolean;
    cut: () => void;
    disableCut: boolean;
  }) => {
    const themeColor = useThemeColor();

    return (
      <Flex
        w={249}
        h={26}
        pos="absolute"
        style={{ zIndex: 10, userSelect: "none", ...BOARD_POSITIONS[pos] }}
      >
        <SeatBox borderColor={color}>
          <Text w={80} size="sm" fw={700} ta="center" ml={5} truncate="end">
            {name}
          </Text>

          <Divider orientation="vertical" color={color} />

          <Group gap={2} w={36} justify="center">
            <Text size="sm" fw={700} ta="end" inline={true}>
              {cards}
            </Text>

            <IconCardsFilled size={14} />
          </Group>

          <Divider orientation="vertical" color={color} />

          <Text
            w={32}
            size="sm"
            fw={700}
            ta="center"
            mr={isOponnent ? undefined : 5}
            c={calledUno ? undefined : themeColor}
            inline={true}
          >
            UNO
          </Text>

          {isOponnent && (
            <>
              <Divider orientation="vertical" color={color} />

              <ActionIcon
                variant="transparent"
                size={14}
                w={16}
                mr={5}
                radius="sm"
                onClick={cut}
                disabled={disableCut}
              >
                <IconScissors size={14} />
              </ActionIcon>
            </>
          )}
        </SeatBox>

        {isOponnent && <OponnentHand name={name} cards={cards} />}
      </Flex>
    );
  },
);

interface Props {
  data: { room: Room; game: GameState; currentPlayerId: string };
  cutCall: (data: PlayerId) => void;
  children: ReactNode;
}

export const GameSeats = ({ data, cutCall, children }: Props) => {
  const themeColor = useThemeColor();
  const { socketId } = useSocket();
  const { room, game, currentPlayerId } = data;

  const client = useMemo(
    () => room.players.find((player) => player.id === socketId),
    [room.players, socketId],
  );

  const playerByPos = useMemo(
    () =>
      Object.fromEntries(
        room.seats.map((s) => {
          const player = room.players.find((p) => p.pos === s.pos);

          return [s.pos, player];
        }),
      ),
    [room.players, room.seats],
  );

  const statesById = useMemo(
    () => Object.fromEntries(game.players.map((p) => [p.id, p])),
    [game.players],
  );

  if (!client) return null;

  return (
    <>
      {room.seats.map((seat) => {
        const pos = getBoardPosition(client.pos, seat.pos);
        const hex = GAME_COLORS[seat.pos - 1].hex;

        const player = playerByPos[seat.pos];

        if (seat.type === undefined || player === undefined) {
          return <SeatBox key={hex} pos={pos} />;
        }

        const borderColor = player.id === currentPlayerId ? hex : themeColor;

        const state = statesById[player.id];

        const canBeCut = state.numCards !== 1 || state.calledUno;

        return (
          <GameSeat
            key={hex}
            pos={pos}
            color={borderColor}
            name={player.name}
            cards={state.numCards}
            calledUno={state.calledUno}
            isOponnent={player.id !== client.id}
            cut={() => {
              cutCall({ playerId: player.id });
            }}
            disableCut={canBeCut}
          />
        );
      })}

      <Stack h="100%" w="100%" p={BOARD_PADDING} gap={0} pos="relative">
        {children}
      </Stack>
    </>
  );
};
