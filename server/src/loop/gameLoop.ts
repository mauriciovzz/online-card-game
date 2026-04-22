import { Server, Socket } from "socket.io";
import { Room, ParsedCard, Game, Turn } from "@/types";
import { users, rooms, games, timers, turns } from "@/stores";
import { roomService, gameService } from "@/services";
import { broadcastRoomList, emitGameLeft, emitGameState, emitRoomInfo, emitSocketHand } from "@/utils/emiterHelper";
import deckHelper from "@/utils/deckHelper";
import logger from "@/utils/logger";

const timeout = (io: Server, roomId: string, playerId: string) => {
  const room = rooms.get(roomId);
  if (!room) return;

  const game = games.get(roomId);
  if (!game) return;

  const turn = turns.get(roomId);
  if (!turn) return; 

  logger.roomLog(roomId, `${users.get(playerId)}'s time ran out.`);
  io.to(roomId).emit("game:timeout", { playerId });

  if (!turn.cardPut && !turn.cardDraw && game.currentEffect !== "SKIP") {
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

    const socketId = game.players[game.currentPlayerIndex].id;
    io.to(room.id).emit("game:state", gameService.getState(game));
    io.to(socketId).emit("game:hand", { hand: gameService.getPlayerHand(game, socketId) });    

    logger.roomLog(roomId, `${users.get(socketId)} auto-drew ${cardsToDraw} cards.`);
  };

  gameService.advanceTurn(game);
  startTurn(io, roomId);
};

const winGame = (io: Server, room: Room, winnerId: string) => {
  logger.roomLog(room.id ,`game ended / ${users.get(winnerId)} won.`)
  
  io.to(room.id).emit("game:won", { playerId: winnerId });

  gameService.cleanUp(room.id);

  const isRoomFull = Number(room.capacity) === room.players.length;
  room.state = isRoomFull ? "FULL" : "WAITING";
  
  io.to(room.id).emit("room:updatedInfo", room);

  if (!isRoomFull) {
    broadcastRoomList(io, roomService.getAvailable());
  };

  return;
};

const startTurn = (io: Server, roomId: string) => {
  const room = rooms.get(roomId);
  if (!room) return;

  const game = games.get(roomId);
  if (!game) return;

  const existingTimer = timers.get(roomId);
  if (existingTimer) clearTimeout(existingTimer);
 
  if (game.currentEffect && !room.rules.stack) {
    const effect = game.currentEffect;
    const skippedPlayerId = game.players[game.currentPlayerIndex].id;

    gameService.skipTurn(game);

    if (effect !== "SKIP") {
      io.to(room.id).emit("game:state", gameService.getState(game));
    
      io.to(skippedPlayerId).emit(
        "game:hand", 
        { hand: gameService.getPlayerHand(game, skippedPlayerId) },
      );      
    };
  };

  const currentPlayerId = game.players[game.currentPlayerIndex].id;

  const turn = gameService.createTurn(roomId, currentPlayerId, game.currentEffect);
  io.to(roomId).emit("game:turnStart", turn);

  logger.roomLog(roomId, `${users.get(currentPlayerId)} started their turn.`);

  const timer = setTimeout(() => {
    timeout(io, roomId, currentPlayerId);
  },  Number(room.turnDuration)* 1000);

  timers.set(roomId, timer);
};

const playCard = (
  io: Server, 
  socket: Socket, 
  roomId: string, 
  card: ParsedCard, 
  room: Room, 
  game: Game, 
  turn: Turn,
) => {
  const hand = game.players[game.currentPlayerIndex].hand;
  deckHelper.put(card.raw, hand, game.pile);  

  game.topCard = card;
  turn.cardPut = true;

  gameService.applyEffect(game, card.type);

  if (hand.length === 0) {
    winGame(io, room, socket.id);
  };

  emitGameState(io, roomId, gameService.getState(game));
  emitSocketHand(socket, gameService.getPlayerHand(game, socket.id)); 
  
  const { stair, mirror, stack } = room.rules;

  if (!stair && !mirror && !stack){
    gameService.advanceTurn(game);
    startTurn(io, roomId);
  };
};

const handlePlayerExit = (
  io: Server,
  socket: Socket,
) => {
  const roomId = socket.data.roomId;

  const room = rooms.get(roomId);
  if (!room) return;

  const game = games.get(roomId);

  const roomDeleted = roomService.leave(socket, room);

  if (!game) {
    broadcastRoomList(io, roomService.getAvailable());

    if (!roomDeleted)
      emitRoomInfo(io, room);
    
    return;
  };

  const gameRes = gameService.leave(socket, game);
  if (!gameRes) return;

  if (gameRes.type === "GAME_WON") {
    emitGameLeft(io, socket, room, gameService.getState(game));
    winGame(io, room, gameRes.winnerId);
    return;
  };

  if (gameRes.type === "GAME_EMPTY") {
    gameService.cleanUp(roomId);
    return;
  };

  emitGameLeft(io, socket, room, gameService.getState(game));

  if (room.state === "PLAYING" && gameRes.wasCurrentPlayer) {
    startTurn(io, roomId);
  };
};

export default {
  startTurn,
  playCard,
  handlePlayerExit,
};
