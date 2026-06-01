import { Group } from "@mantine/core";
import {
  IconNumber1,
  IconPlayerSkipForwardFilled,
  IconSettings,
} from "@tabler/icons-react";

import { useRoom } from "@/contexts/RoomContext";
import { useChat } from "@/contexts/ChatContext";
import {
  AppActionIcon,
  AppButton,
  ChatButton,
} from "@/components";

import type { Turn } from "@shared/types";

interface Props {
  turn: Turn;
  myTurn: boolean;
  stack: boolean;
  canCallUno: boolean;
  funcs: {
    drawCard: () => void;
    endTurn: () => void;
    endStack: () => void;
    callUno: () => void;
  };
}

export const GameBar = (props: Props) => {
  const { myTurn, turn, canCallUno, stack, funcs } = props;

  const { drawCard, endTurn, callUno, endStack } = funcs;
  const { cardDraw, cardPut } = turn;

  const { openSettings } = useRoom();
  const { openChat } = useChat();

  const canStack = myTurn && turn.effect !== null && stack;

  return (
    <Group gap="sm">
      {canStack ? (
        <AppButton
          expand
          text="game.dontStack"
          onClick={endStack}
        />
      ) : (
        <>
          <AppButton
            expand
            text="game.draw"
            onClick={drawCard}
            disabled={!myTurn || cardDraw || cardPut}
          />
          <AppActionIcon
            disabled={!myTurn || (!cardDraw && !cardPut)}
            onClick={endTurn}
          >
            <IconPlayerSkipForwardFilled
              size={20}
              stroke={2}
            />
          </AppActionIcon>
        </>
      )}

      <AppActionIcon
        disabled={!canCallUno}
        onClick={callUno}
      >
        <IconNumber1 size={20} stroke={2} />
      </AppActionIcon>

      <ChatButton onClick={() => openChat()} />

      <AppActionIcon onClick={openSettings}>
        <IconSettings size={20} stroke={2} />
      </AppActionIcon>
    </Group>
  );
};
