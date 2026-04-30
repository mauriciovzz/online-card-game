import { gameService } from "@/services";
import {
  turnGuard,
  gameGuard,
  getRoom,
  isPlayerInRoom,
} from "@/utils/guards";
import {
  emitGameData,
  emitPlayerHand,
  notOk,
  ok,
} from "@/utils/emiterHelper";

import { AppServer, AppSocket } from "@/types";
import cardsHelper from "@/utils/cardsHelper";
import {
  handleExit,
  playCard,
  startTurn,
} from "@/loop/gameLoop";

export const gameSocket = (
  io: AppServer,
  socket: AppSocket
) => {
  socket.on("game:getData", (callback) => {
    const data = gameGuard(socket, callback);
    if (!data) return;

    const { game } = data;

    const gameState = gameService.getState(game);
    const hand = gameService.getHand(game, socket.id);

    ok(callback, { gameState, ...hand });
  });

  socket.on("game:playCard", (playedCard, callback) => {
    const data = turnGuard(socket, callback);
    if (!data) return;

    const { room, game, turn } = data;

    const res = cardsHelper.parseCard(playedCard);

    if (!res.success) {
      notOk(callback, res.error);
      return;
    }

    const card = res.data;

    const playerHand = gameService.getHand(game, socket.id);
    const { hand } = playerHand;

    if (!hand.includes(card.raw)) {
      notOk(callback, "CARD_NOT_FOUND");
      emitPlayerHand(io, socket.id, playerHand);
      return;
    }

    if (hand.length === 1 && card.type !== "NUMBER") {
      notOk(callback, "INVALID_MOVE");
      return;
    }

    const { rules } = room;
    const canPlayAgain = rules.stair || rules.mirror;

    // stack on
    if (game.currEffect) {
      const isValid = game.currEffect === card.type;

      if (!isValid) {
        notOk(callback, "INVALID_MOVE");
        return;
      }

      const playerData = { id: socket.id, hand, card };
      playCard(io, callback, playerData, room, game, turn);
    }

    // stair on / mirror on
    else if (turn.cardPut && canPlayAgain) {
      const isValid = cardsHelper.checkChainMove(
        game.topCard,
        card,
        rules
      );

      if (!isValid) {
        notOk(callback, "INVALID_MOVE");
        return;
      }

      const playerData = { id: socket.id, hand, card };
      playCard(io, callback, playerData, room, game, turn);
    }

    // first move
    else {
      if (turn.cardPut) {
        notOk(callback, "ALREADY_PLAYED");
        return;
      }

      const isValid = cardsHelper.checkMove(
        game.topCard,
        card
      );

      if (!isValid) {
        notOk(callback, "INVALID_MOVE");
      }

      const playerData = { id: socket.id, hand, card };
      playCard(io, callback, playerData, room, game, turn);
    }
  });

  socket.on("game:drawCard", (callback) => {
    const data = turnGuard(socket, callback);
    if (!data) return;

    const { room, game, turn } = data;

    if (game.currEffect === "SKIP") {
      notOk(callback, "TURN_SKIPPED");
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

    let cardsToDraw = 1;

    if (game.currEffect) {
      cardsToDraw = game.currDrawStack;
      game.currDrawStack = 0;
    }

    cardsHelper.draw(
      game.players[game.currPlayerIndex],
      cardsToDraw,
      game.deck,
      game.pile
    );

    turn.cardDraw = true;

    const hand = gameService.getHand(game, socket.id);
    ok(callback, hand);

    const gameState = gameService.getState(game);
    emitGameData(io, room.id, gameState);
  });

  socket.on("game:endTurn", (callback) => {
    const data = turnGuard(socket, callback);
    if (!data) return;

    const { room, game, turn } = data;

    const drawEffect = game.currEffect !== "SKIP";
    const notPlayed = !turn.cardPut && !turn.cardDraw;

    if (drawEffect && notPlayed) {
      notOk(callback, "TURN_INCOMPLETE");
      return;
    }

    gameService.advanceTurn(game);

    startTurn(io, room.id);
  });

  socket.on("game:unoCall", (callback) => {
    const data = gameGuard(socket, callback);
    if (!data) return;

    const { room, game } = data;

    const player = game.players.find(
      (p) => p.id === socket.id
    );

    if (!player) return;

    if (player.hand.length !== 1) {
      notOk(callback, "INVALID_UNO_CALL");
      return;
    }

    if (player.calledUno) {
      notOk(callback, "UNO_ALREADY_CALLED");
      return;
    }

    player.calledUno = true;
    ok(callback, null);

    const gameState = gameService.getState(game);
    emitGameData(io, room.id, gameState);
  });

  socket.on("game:cutCall", ({ playerId }, callback) => {
    const data = gameGuard(socket, callback, playerId);
    if (!data) return;

    const { room, game } = data;

    const player = game.players.find(
      (p) => p.id === playerId
    );
    if (!player) return;

    const { hand, calledUno } = player;

    if (hand.length !== 1 || calledUno) {
      notOk(callback, "INVALID_CUT_CALL");
      return;
    }

    if (playerId === socket.id) {
      notOk(callback, "CANNOT_SELF_CUT");
      return;
    }

    cardsHelper.draw(player, 2, game.deck, game.pile);

    const playerHand = gameService.getHand(game, playerId);
    emitPlayerHand(io, playerId, playerHand);

    const gameState = gameService.getState(game);
    emitGameData(io, room.id, gameState);

    ok(callback, null);
  });

  socket.on("game:leave", (callback) => {
    const room = getRoom(socket, undefined, callback);
    if (!room) return;

    const isInRoom = isPlayerInRoom(room, room.id);
    if (!isInRoom) {
      console.log("check here");
      return;
    }

    handleExit(io, socket);
  });
};
