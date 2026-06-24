import { memo, useMemo, type ReactNode } from "react";
import {
  Group,
  Divider,
  ActionIcon,
  Text,
  Stack,
  Flex,
  Image,
  Paper,
} from "@mantine/core";
import {
  IconCardsFilled,
  IconScissors,
} from "@tabler/icons-react";

import { GAME_COLORS } from "@/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useThemeColor } from "@/hooks";

import type {
  Room,
  GameState,
  PlayerId,
} from "@shared/types";

const PLAYER_OFFSET = 12;
const SIDE_OFFSET = -98;
const BOARD_PADDING = 38;

const LAYOUT = {
  cardsPerRow: 14,
  cardWidth: 20,
  cardHeight: 31.41,
  rowOffset: 10,
} as const;

const PlayerHand = memo(
  ({ name, cards }: { name: string; cards: number }) => {
    const width = 225;

    const spacing = useMemo(() => {
      const totalCardWidth = cards * LAYOUT.cardWidth;
      const spacesBetweenCards = cards - 1;

      const spaceLeft = totalCardWidth - width;

      const spacing =
        totalCardWidth <= width
          ? 0
          : spaceLeft / spacesBetweenCards;

      return spacing;
    }, [width, cards]);

    const handWidth =
      cards === 0
        ? 0
        : LAYOUT.cardWidth +
          (cards - 1) * (LAYOUT.cardWidth - spacing);

    const positionedCards = Array.from(
      { length: cards },
      (_, index) => ({
        left: index * (LAYOUT.cardWidth - spacing),
      })
    );

    return (
      <Flex
        w={width}
        h={LAYOUT.cardHeight}
        justify="center"
        align="center"
      >
        <Flex
          pos="relative"
          w={handWidth}
          h={LAYOUT.cardHeight}
        >
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
    );
  }
);

const PlayerCard = memo(
  ({
    pos,
    name,
    cards,
    borderColor,
    unoColor,
    isOponnent,
    cut,
    disableCut,
  }: {
    pos: Position;
    name: string;
    cards: number;
    borderColor: string;
    unoColor?: string;
    isOponnent: boolean;
    cut: () => void;
    disableCut: boolean;
  }) => (
    <Flex
      pos="absolute"
      style={{
        zIndex: 10,
        userSelect: "none",
        ...positionsMap[pos],
      }}
    >
      <Paper
        p={5}
        bd={`1px solid ${borderColor}`}
        bdrs="md"
        style={{
          display: "flex",
          gap: 10,
          zIndex: 2,
        }}
      >
        <Text
          w={80}
          size="sm"
          fw={700}
          ta="center"
          inline={true}
          ml={5}
          truncate="end"
        >
          {name}
        </Text>

        <Divider
          orientation="vertical"
          color={borderColor}
        />

        <Group gap={2} w={36} justify="center">
          <Text size="sm" fw={700} ta="end" inline={true}>
            {cards}
          </Text>

          <IconCardsFilled size={14} />
        </Group>

        <Divider
          orientation="vertical"
          color={borderColor}
        />

        <Text
          w={32}
          size="sm"
          fw={700}
          ta="center"
          mr={isOponnent ? undefined : 5}
          c={unoColor}
          inline={true}
        >
          UNO
        </Text>

        {isOponnent && (
          <>
            <Divider
              orientation="vertical"
              color={borderColor}
            />

            <ActionIcon
              variant="transparent"
              size={14}
              w={16}
              mr={5}
              bdrs="sm"
              onClick={cut}
              disabled={disableCut}
            >
              <IconScissors size={14} />
            </ActionIcon>
          </>
        )}
      </Paper>

      {isOponnent && (
        <Group
          w="100%"
          justify="center"
          pos="absolute"
          style={{
            transform: "rotate(180deg)",
            top: 15,
            zIndex: 1,
          }}
        >
          <PlayerHand name={name} cards={cards} />
        </Group>
      )}
    </Flex>
  )
);

type Position = "top" | "bottom" | "left" | "right";

const positionsMap: Record<Position, React.CSSProperties> =
  {
    bottom: { bottom: PLAYER_OFFSET },
    left: {
      left: SIDE_OFFSET,
      transform: "rotate(-90deg)",
    },
    top: { top: PLAYER_OFFSET },
    right: {
      right: SIDE_OFFSET,
      transform: "rotate(90deg)",
    },
  };

const layout: Position[] = [
  "bottom",
  "left",
  "top",
  "right",
];

const getSeatPos = (
  clientPos: number,
  seatPos: number
): Position => {
  const relative = (seatPos - clientPos + 4) % 4;

  return layout[relative];
};

interface Props {
  data: {
    room: Room;
    game: GameState;
    currentPlayerId: string;
  };
  cutCall: (data: PlayerId) => void;
  children: ReactNode;
}

export const PlayersCards = ({
  data,
  cutCall,
  children,
}: Props) => {
  const themeColor = useThemeColor();
  const { socket } = useSocket();
  const { room, game, currentPlayerId } = data;

  const client = useMemo(
    () =>
      room.players.find(
        (player) => player.id === socket?.id
      ),
    [room.players, socket?.id]
  );

  const playerByPos = useMemo(
    () =>
      Object.fromEntries(
        room.players.map((p) => [p.pos, p])
      ),
    [room.players]
  );

  const statesById = useMemo(
    () =>
      Object.fromEntries(
        game.players.map((p) => [p.id, p])
      ),
    [game.players]
  );

  if (!client) return null;

  return (
    <>
      {room.seats.map((seat) => {
        const pos = getSeatPos(client.pos, seat.pos);

        if (seat.type === undefined) {
          return (
            <Paper
              w={249}
              h={26}
              withBorder
              pos="absolute"
              style={{ ...positionsMap[pos] }}
            />
          );
        }

        const player = playerByPos[seat.pos];
        const hex = GAME_COLORS[seat.pos - 1].hex;

        const borderColor =
          player.id === currentPlayerId ? hex : themeColor;

        const state = statesById[player.id];

        const playerUnoColor = state.calledUno
          ? undefined
          : themeColor;

        const canBeCut =
          state.numCards !== 1 || state.calledUno;

        return (
          <PlayerCard
            key={player.id}
            pos={pos}
            name={player.name}
            cards={state.numCards}
            borderColor={borderColor}
            unoColor={playerUnoColor}
            isOponnent={player.id !== client.id}
            cut={() => cutCall({ playerId: player.id })}
            disableCut={canBeCut}
          />
        );
      })}

      <Stack
        h="100%"
        w="100%"
        p={BOARD_PADDING}
        gap={0}
        pos="relative"
      >
        {children}
      </Stack>
    </>
  );
};
