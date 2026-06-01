import { gameService } from "@/services";
import { turnGuard, gameGuard } from "@/utils/guards";
import {
  emitCutInfo,
  emitEffect,
  emitGameData,
  emitPlayerHand,
  emitTurn,
  emitUnoCall,
  notOk,
  ok,
} from "@/utils/emiterHelper";
import { playCard, startTurn } from "@/loop/gameLoop";
import deckHelper from "@/utils/deckHelper";

import { CARD_COLORS } from "@shared/constants/cardVariables";
import moveHelper from "@shared/utils/moveHelper";

import { Card, PlayerState } from "@shared/types";
import { AppServer, AppSocket } from "@/types";

export const gameSocket = (
  io: AppServer,
  socket: AppSocket
) => {
  socket.on("game:getData", (callback) => {
    const gameData = gameGuard(socket, callback);
    if (!gameData) return;

    const initialData = {
      gameState: gameService.getState(gameData.game),
      cards: gameData.state.cards,
    };

    ok(callback, initialData);
  });

  socket.on("game:playCard", (playedCard, callback) => {
    const { cardId, chosenColor } = playedCard;

    const turnData = turnGuard(socket, callback);
    if (!turnData) return;

    const { room, game, turn, state } = turnData;
    const { cards } = state;

    const getCard = (c: Card) => c.id === cardId;
    const card = cards.find(getCard);

    if (!card) {
      notOk(callback, "CARD_NOT_FOUND");
      return;
    }

    const { type } = card;

    if (type === "WILD_CARD" || type === "DRAW_FOUR") {
      if (!chosenColor) {
        notOk(callback, "COLOR_MISSING");
        return;
      }

      if (!CARD_COLORS.includes(chosenColor)) {
        notOk(callback, "INVALID_COLOR");
        return;
      }
    }

    if (cards.length === 1 && type !== "NUMBER") {
      notOk(callback, "HAS_TO_BE_NUMBER");
      return;
    }

    const { rules } = room;
    const canPlayAgain = rules.stair || rules.mirror;

    // stack on
    if (game.currEffect) {
      const isValid = game.currEffect === type;

      if (!isValid) {
        notOk(callback, "INVALID_MOVE");
        return;
      }
    }

    // stair on / mirror on
    else if (turn.cardPut && canPlayAgain) {
      const isValid = moveHelper.checkChainMove(
        game.topCard,
        card,
        rules
      );

      if (!isValid) {
        notOk(callback, "INVALID_MOVE");
        return;
      }
    }

    // first move
    else {
      if (turn.cardPut) {
        notOk(callback, "ALREADY_PLAYED");
        return;
      }

      const isValid = moveHelper.checkMove(
        game.topCard,
        card
      );

      if (!isValid) {
        notOk(callback, "INVALID_MOVE");
        return;
      }
    }

    ok(callback, {});
    playCard(io, callback, turnData, socket.id, playedCard);
  });

  socket.on("game:drawCard", (callback) => {
    const turnData = turnGuard(socket, callback);
    if (!turnData) return;

    const { room, game, turn, state } = turnData;

    if (game.currEffect) {
      notOk(callback, "EFFECT_ON");
      return;
    }

    if (turn.cardPut) {
      notOk(callback, "ALREADY_PLAYED");
      return;
    }

    if (turn.cardDraw) {
      notOk(callback, "ALREADY_DRAWN");
      return;
    }

    const updatedHand = deckHelper.draw(state, 1, game);
    ok(callback, updatedHand);

    turn.cardDraw = true;
    emitTurn(io, room.id, turn);

    const gameState = gameService.getState(game);
    emitGameData(io, room.id, gameState);
  });

  socket.on("game:endTurn", (callback) => {
    const turnData = turnGuard(socket, callback);
    if (!turnData) return;

    const { room, game, turn } = turnData;

    const notPlayed = !turn.cardPut && !turn.cardDraw;

    if (notPlayed) {
      notOk(callback, "TURN_INCOMPLETE");
      return;
    }

    ok(callback, {});

    gameService.advanceTurn(game);
    startTurn(io, room.id);
  });

  socket.on("game:endStack", (callback) => {
    const turnData = turnGuard(socket, callback);
    if (!turnData) return;

    const { room, game, turn, state } = turnData;

    let updatedHand = undefined;

    if (turn.effect !== "SKIP") {
      const nc = game.currDrawStack;
      game.currDrawStack = 0;

      updatedHand = deckHelper.draw(state, nc, game);
      ok(callback, updatedHand);

      const numCards = updatedHand.cards.length;
      emitEffect(io, state.id, state.pos, numCards);

      const gameState = gameService.getState(game);
      emitGameData(io, room.id, gameState);
    } else {
      ok(callback, {});
      emitEffect(io, state.id, state.pos);
    }

    gameService.advanceTurn(game);
    startTurn(io, room.id);
  });

  socket.on("game:unoCall", (callback) => {
    const gameData = gameGuard(socket, callback);
    if (!gameData) return;

    const { room, game, state } = gameData;

    if (state.cards.length !== 1) {
      notOk(callback, "INVALID_UNO_CALL");
      return;
    }

    if (state.calledUno) {
      notOk(callback, "UNO_ALREADY_CALLED");
      return;
    }

    state.calledUno = true;

    const gameState = gameService.getState(game);
    emitGameData(io, room.id, gameState);

    const notificationData = {
      name: state.name,
      pos: state.pos,
    };

    ok(callback, notificationData);
    emitUnoCall(socket, room.id, notificationData);
  });

  socket.on("game:cutCall", ({ playerId }, callback) => {
    const gameData = gameGuard(socket, callback);
    if (!gameData) return;

    const { room, game, state } = gameData;

    const find = (p: PlayerState) => p.id === playerId;
    const cutted = game.players.find(find);
    if (!cutted) return;

    if (cutted.cards.length !== 1 || cutted.calledUno) {
      notOk(callback, "INVALID_CUT_CALL");
      return;
    }

    if (playerId === socket.id) {
      notOk(callback, "CANNOT_SELF_CUT");
      return;
    }

    const updatedHand = deckHelper.draw(cutted, 2, game);
    emitPlayerHand(io, cutted.id, updatedHand);

    const gameState = gameService.getState(game);
    emitGameData(io, room.id, gameState);

    ok(callback, { name: cutted.name, pos: cutted.pos });

    const cutInfo = {
      cuttedId: cutted.id,
      cuttedName: cutted.name,
      cuttedPos: cutted.pos,
      cutterName: state.name,
      cutterPos: state.pos,
    };

    emitCutInfo(socket, room.id, cutInfo);
  });
};
