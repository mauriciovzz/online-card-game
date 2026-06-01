import { memo, type ReactNode } from "react";
import {
  Group,
  Divider,
  ActionIcon,
  Text,
  Stack,
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
  Turn,
  PlayerId,
} from "@shared/types";

const positionsMap: Record<Position, React.CSSProperties> =
  {
    bottom: { bottom: 12 },
    left: {
      left: -98,
      transform: "rotate(-90deg)",
    },
    top: { top: 12 },
    right: {
      right: -98,
      transform: "rotate(90deg)",
    },
  };

type Position = "top" | "bottom" | "left" | "right";
type PlayerseLength = 2 | 3 | 4;

interface PlayerCardProps {
  borderColor: string;
  name: string;
  cards: number;
  unoColor?: string;
  cut?: () => void;
  pos: Position;
  disableCut: boolean;
}

const PlayerCard = memo(
  ({
    borderColor,
    name,
    cards,
    unoColor,
    cut,
    pos,
    disableCut,
  }: PlayerCardProps) => (
    <Group
      p={5}
      pos="absolute"
      bd={`1px solid ${borderColor}`}
      bdrs="md"
      gap={10}
      style={{
        zIndex: 10,
        userSelect: "none",
        ...positionsMap[pos],
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

      <Divider orientation="vertical" color={borderColor} />

      <Group gap={2} w={36} justify="center">
        <Text size="sm" fw={700} ta="end" inline={true}>
          {cards}
        </Text>

        <IconCardsFilled size={14} />
      </Group>

      <Divider orientation="vertical" color={borderColor} />

      <Text
        w={32}
        size="sm"
        fw={700}
        ta="center"
        mr={cut ? undefined : 5}
        c={unoColor}
        inline={true}
      >
        UNO
      </Text>

      {cut && (
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
    </Group>
  )
);

const layouts = {
  2: ["bottom", "top"],
  3: ["bottom", "left", "right"],
  4: ["bottom", "left", "top", "right"],
} as const;

const getPlayerPos = (
  clientPos: number,
  playerPos: number,
  players: PlayerseLength
) => {
  const relative =
    (playerPos - clientPos + players) % players;

  return layouts[players][relative];
};

interface Props {
  data: {
    room: Room;
    game: GameState;
    turn: Turn;
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
  const { room, game, turn } = data;

  const client = room.players.find(
    (player) => player.id === socket?.id
  );

  if (!client) return null;

  return (
    <>
      {room.players.map((player) => {
        const isPlaying =
          player.id === turn.currentPlayerId;
        const playerColor = GAME_COLORS[player.pos - 1].hex;

        const borderColor = isPlaying
          ? playerColor
          : themeColor;

        const state = game.players.find(
          (p) => p.id === player.id
        );

        if (!state) return null;

        const playerUnoColor = state.calledUno
          ? undefined
          : themeColor;

        const position = getPlayerPos(
          client.pos,
          player.pos,
          room.players.length as PlayerseLength
        );

        return (
          <PlayerCard
            key={player.id}
            borderColor={borderColor}
            name={player.name}
            cards={state.numCards}
            unoColor={playerUnoColor}
            pos={position}
            cut={
              player.id === client.id
                ? undefined
                : () => cutCall({ playerId: player.id })
            }
            disableCut={
              state.numCards !== 1 || state.calledUno
            }
          />
        );
      })}

      <Stack
        h="100%"
        w="100%"
        p={26 + 12}
        gap={0}
        pos="relative"
      >
        {children}
      </Stack>
    </>
  );
};
