import { Server, Socket } from "socket.io";
import { users, rooms, games, turns } from "@/stores";
import { gameService } from "@/services";
import deckHelper from "@/utils/deckHelper";
import { emitGameError, emitGameState, emitSocketHand } from "@/utils/emiterHelper";
import logger from "@/utils/logger";
import gameLoop from "@/loop/gameLoop";
import { Card, CardColor } from "@/types";

export const gameSocket = (io: Server, socket: Socket) => {

  socket.on("game:start", ({ roomId }) => {
    const room = rooms.get(roomId);

    if (!room) {
      io.to(roomId).emit("game:started", {
        success: false,
        error: "ROOM_NOT_FOUND",
        data: null,
      });
      return; 
    };

    if (room.adminId !== socket.id) {
      emitGameError(socket, roomId, "game:started", "NOT_ADMIN");
      return; 
    };

    gameService.createGame(roomId, room);

    io.to(roomId).emit("game:started", {
      success: true,
      error: null,
      data: { roomId },
    });

    logger.roomLog(roomId, 'Game started.')

    setTimeout(() => {
      gameLoop.startTurn(io, roomId);
    }, 1000);
  });

  socket.on("game:getState", ({ roomId }) => {
    const game = games.get(roomId);
    if (!game) return;

    socket.emit("game:state", gameService.getState(game));
    emitSocketHand(socket, gameService.getPlayerHand(game, socket.id));
  });

  socket.on("game:move", ({ roomId, card, color }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const game = games.get(roomId);
    if (!game) return; 

    const turn = turns.get(roomId);
    if (!turn) return; 

    if (turn.currentPlayerId !== socket.id) {
      emitGameError(socket, roomId, "game:moved", "NOT_YOUR_TURN");
      return;
    };

    if (deckHelper.checkCard(card)) {
      emitGameError(socket, roomId, "game:moved", "INVALID_CARD");
      return;
    };

    if (deckHelper.checkColor(color)) {
      emitGameError(socket, roomId, "game:moved", "INVALID_COLOR");
      return;
    };

    const hand = gameService.getPlayerHand(game, socket.id);
  
    if (!hand.includes(card)) {
      emitGameError(socket, roomId, "game:moved", "CARD_NOT_FOUND");
      emitSocketHand(socket, gameService.getPlayerHand(game, socket.id));
      return;
    };

    let parsedCard = deckHelper.parseCard(card as Card, color as CardColor);
    
    if (hand.length === 1 && parsedCard.type !== "NUMBER") {
      emitGameError(socket, roomId, "game:moved", "INVALID_MOVE");
      return;
    };

    // stack on
    if (game.currentEffect) {
      const isValidStack = game.currentEffect === parsedCard.type;

      if (!isValidStack) {
        emitGameError(socket, roomId, "game:moved", "INVALID_MOVE");
        return;
      };

      gameLoop.playCard(io, socket, roomId, parsedCard, room, game, turn);
    }

    // stair on / mirror on
    else if (turn.cardPut && (room.rules.stair || room.rules.mirror)) {
      if (!deckHelper.isValidChainMove(game.topCard, parsedCard, room.rules)) {
        emitGameError(socket, roomId, "game:moved", "INVALID_MOVE");
        return;
      };

      gameLoop.playCard(io, socket, roomId, parsedCard, room, game, turn);
    }

    // first move 
    else {
      if (turn.cardPut) {
        emitGameError(socket, roomId, "game:moved", "INVALID_MOVE");
        return;
      };

      if (deckHelper.isValidMove(game.topCard, parsedCard)) {
        emitGameError(socket, roomId, "game:moved", "INVALID_MOVE");
        return;
      };
        
      gameLoop.playCard(io, socket, roomId, parsedCard, room, game, turn);          
    }    
  });

  socket.on("game:draw", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const game = games.get(roomId);
    if (!game) return; 

    const turn = turns.get(roomId);
    if (!turn) return; 

    if (turn.currentPlayerId !== socket.id) {
      emitGameError(socket, roomId, "game:drawn", "NOT_YOUR_TURN");
      return;
    };

    if (game.currentEffect === "SKIP") {
      emitGameError(socket, roomId, "game:drawn", "TURN_SKIPPED");
      return;
    };

    if (turn.cardPut) {
      emitGameError(socket, roomId, "game:drawn", "ALREADY_PLAYED");
      return;
    };

    if (turn.cardDraw) {
      emitGameError(socket, roomId, "game:drawn", "ALREADY_DRAWN");
      return;
    };
  
    let cardsToDraw = 1; 
    
    if (game.currentEffect) {
      cardsToDraw = game.currentDrawStack;
      game.currentDrawStack = 0;
    };
    
    const { players, currentPlayerIndex, deck, pile } = game;

    deckHelper.draw(
      players[currentPlayerIndex],
      deck,
      pile, 
      cardsToDraw,
    );

    turn.cardDraw = true;
    
    emitGameState(io, roomId, gameService.getState(game));
    emitSocketHand(socket, gameService.getPlayerHand(game, socket.id));
  });

  socket.on("game:endTurn", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const game = games.get(roomId);
    if (!game) return;

    const turn = turns.get(roomId);
    if (!turn) return; 

    if (turn.currentPlayerId !== socket.id) {
      emitGameError(socket, roomId, "game:turnEnded", "NOT_YOUR_TURN");
      return;
    };

    if (game.currentEffect !== "SKIP" && (!turn.cardPut && !turn.cardDraw)) {
      emitGameError(socket, roomId, "game:turnEnded", "TURN_INCOMPLETE");
      return;
    };

    logger.roomLog(roomId, `${users.get(socket.id)} finished their turn.`);

    gameService.advanceTurn(game);
    gameLoop.startTurn(io, roomId);
  });

  socket.on("game:unoCall", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const game = games.get(roomId);
    if (!game) return;

    const player = game.players.find((p) => p.id === socket.id);
    if (!player) return;

    if (player.hand.length !== 1) {
      emitGameError(socket, roomId, "game:unoCalled", "INVALID_UNO_CALL");
      return;
    };

    if (player.calledUno) {
      emitGameError(socket, roomId, "game:unoCalled", "UNO_ALREADY_CALLED");
      return;
    };
  
    player.calledUno = true;
    
    socket.emit("game:state", gameService.getState(game));
    io.to(roomId).emit("game:calledUno", { playerId: socket.id });
  });

  socket.on("game:cutCall", ({ roomId, cutPlayerId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const game = games.get(roomId);
    if (!game) return;

    const cutPlayer = game.players.find((p) => p.id === cutPlayerId);
    if (!cutPlayer) return;

    if (cutPlayer.hand.length !== 1 || cutPlayer.calledUno) {
      emitGameError(socket, roomId, "game:cutCalled", "INVALID_CUT_CALL");
      return;
    };

    if (cutPlayerId === socket.id) {
      emitGameError(socket, roomId, "game:cutCalled", "CANNOT_SELF_CUT");
      return;
    };

    deckHelper.draw(
      cutPlayer,
      game.deck,
      game.pile, 
      2,
    );

    io.to(room.id).emit("game:state", gameService.getState(game));
    io.to(cutPlayer.id).emit("game:hand", { hand: gameService.getPlayerHand(game, cutPlayer.id) }); 

    socket.emit("game:cutCalled", {
      success: true,
      error: null,
      data: { cutPlayerId }
    });
  });

  socket.on("game:leave", ({ roomId }) => { 
    const room = rooms.get(roomId);

    if (!room) {
      emitGameError(socket, roomId, "room:left", "ROOM_NOT_FOUND")
      return; 
    };

    const isInRoom = room.players.some((p) => p.id === socket.id);
    if (!isInRoom) {
      emitGameError(socket, roomId, "room:left", "NOT_IN_ROOM")
      return; 
    };   

    gameLoop.handlePlayerExit(io, socket);
  });

};
