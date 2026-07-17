import { Group } from "@mantine/core";
import { IconNumber1 } from "@tabler/icons-react";

import { useChat } from "@/contexts/ChatContext";
import {
  AppActionIcon,
  AppButton,
  ChatButton,
  SettingsButton,
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
  clientColor: string;
}

export const GameBar = ({
  myTurn,
  turn,
  canCallUno,
  stack,
  funcs,
  clientColor,
}: Props) => {
  const { drawCard, endTurn, callUno, endStack } = funcs;
  const { draw } = turn.actions;

  const { openChat } = useChat();

  const canStack = myTurn && turn.effect !== null && stack;

  const action = !myTurn
    ? {
        text: "game.draw",
        onClick: drawCard,
        disabled: true,
        color: undefined,
      }
    : canStack
      ? {
          text: "game.dontStack",
          onClick: endStack,
          disabled: false,
          color: clientColor,
        }
      : draw
        ? {
            text: "game.draw",
            onClick: drawCard,
          }
        : {
            text: "game.continue",
            onClick: endTurn,
          };

  return (
    <Group gap="sm">
      <AppButton
        expand
        text={action.text}
        onClick={action.onClick}
        disabled={action.disabled}
        color={action.color}
      />

      <AppActionIcon
        disabled={!canCallUno}
        onClick={callUno}
      >
        <IconNumber1 size={20} stroke={2} />
      </AppActionIcon>

      <ChatButton onClick={openChat} />

      <SettingsButton />
    </Group>
  );
};
