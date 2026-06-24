import aiService from "./ai.service";
import {
  playCard,
  endTurn,
  endStack,
  drawCard,
} from "../gameActions";
import { getTurnData } from "@/utils/guards";

import { AppServer } from "@/types";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ---------

export const startAiTurn = async (
  io: AppServer,
  roomId: string
) => {
  const turnData = getTurnData(io, roomId);
  if (!turnData) return;

  const { room, game, state } = turnData;

  await sleep(1200);

  // STACK RESPONSE

  if (game.currEffect) {
    const stackMove = aiService.getMove(game, state);

    await sleep(1200);

    if (!stackMove) {
      endStack(io, turnData);
      return;
    }

    playCard(io, turnData, {
      cardId: stackMove.card.id,
      chosenColor: stackMove.chosenColor,
    });

    return;
  }

  // NORMAL PLAY

  let move = aiService.getMove(game, state);

  // DRAW

  if (!move) {
    await sleep(1200);

    drawCard(io, turnData);

    await sleep(1200);

    move = aiService.getMove(game, state);

    // Still can't play
    if (!move) {
      endTurn(io, room.id, game);
      return;
    }
  }

  // PLAY

  playCard(io, turnData, {
    cardId: move.card.id,
    chosenColor: move.chosenColor,
  });

  await sleep(1200);

  // CONTINUE WITH MIRROR / STAIR

  const { mirror, stair } = room.rules;

  const hasChainRule = mirror || stair;
  const playedNumberCard = move.card.type === "NUMBER";

  const canContinueTurn = hasChainRule && playedNumberCard;

  if (canContinueTurn) {
    let canPlay = true;

    while (canPlay) {
      const currTurnData = getTurnData(io, roomId);
      if (!currTurnData) return;

      if (currTurnData.turn.currentPlayerId !== state.id) {
        return;
      }

      const nextMove = aiService.getChainMove(currTurnData);

      if (!nextMove) {
        endTurn(io, room.id, currTurnData.game);
        canPlay = false;
      } else {
        await sleep(1200);

        playCard(io, currTurnData, {
          cardId: nextMove.id,
        });
      }
    }
  }
};
