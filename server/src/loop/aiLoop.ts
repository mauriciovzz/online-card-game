import { aiService } from "@/services";
import {
  playCard,
  endTurn,
  endStack,
  drawCard,
} from "./gameActions";
import { getTurnData } from "@/utils/guards";

import { AppServer } from "@/types";
import logger from "@/utils/logger";

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

  logger.turnStart(state.name, game);

  await sleep(1200);

  // STACK RESPONSE

  if (game.currEffect) {
    const stackMove = aiService.getMove(game, state);

    if (!stackMove) {
      logger.info(`[${state.name}] ENDED STACK`);

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

    const newHand = drawCard(io, turnData);

    logger.drawCard(
      state.name,
      newHand.cards[0].raw,
      state.cards.map((c) => c.raw)
    );

    move = aiService.getMove(game, state);

    // Still can't play
    if (!move) {
      logger.info(`[${state.name}] ENDED TURN AFTER DRAWN`);

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
        logger.info(`[${state.name}]: out of turn.`);
        return;
      }

      const nextMove = aiService.getChainMove(currTurnData);

      if (!nextMove) {
        logger.info(
          `[${state.name}] ENDED IN MIRROR / STAIR LOOP`
        );

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
