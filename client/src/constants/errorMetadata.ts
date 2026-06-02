import type { ErrorCode } from "@shared/constants/errorCodes";

export interface ErrorConfig {
  message?: string;
  redirect?: string;
}

export const ERROR_METADATA: Record<
  ErrorCode,
  ErrorConfig
> = {
  // Generic
  SERVER_ERROR: {
    message: "errors.room.serverError",
  },

  // User / Room - Name
  NAME_EMPTY: {
    message: "errors.name.empty",
  },

  USER_LENGTH: {
    message: "errors.name.maxLength",
  },

  NAME_TAKEN: {
    message: "errors.name.taken",
  },

  ROOM_LENGTH: {
    message: "errors.room.maxLength",
  },

  // Room
  ROOM_NOT_FOUND: {
    message: "errors.room.serverError",
    redirect: "/",
  },

  ROOM_FULL: {
    message: "errors.room.isFull",
  },

  NOT_IN_ROOM: {
    message: "errors.room.notInRoom",
    redirect: "/",
  },

  NOT_ADMIN: {
    message: "errors.room.notAdmin",
  },

  NOT_ENOUGH_PLAYERS: {
    message: "errors.room.notEnoughtPlayers",
  },

  CAPACITY_CONFLICT: {
    message: undefined,
  },

  PLAYER_NOT_FOUND: {
    message: "errors.room.playerNotFound",
  },

  // Game
  GAME_NOT_FOUND: {
    message: "errors.room.serverError",
    redirect: "/",
  },

  TURN_NOT_FOUND: {
    message: "errors.room.serverError",
    redirect: "/",
  },

  NOT_YOUR_TURN: {
    message: "errors.game.notYourTurn",
  },

  // Card play
  CARD_NOT_FOUND: {
    message: undefined,
  },

  COLOR_MISSING: {
    message: undefined,
  },

  INVALID_COLOR: {
    message: undefined,
  },

  HAS_TO_BE_NUMBER: {
    message: undefined,
  },

  INVALID_MOVE: {
    message: undefined,
  },

  // Turn actions
  ALREADY_DRAW: {
    message: undefined,
  },

  ALREADY_PLAYED: {
    message: undefined,
  },

  TURN_INCOMPLETE: {
    message: undefined,
  },

  EFFECT_ON: {
    message: undefined,
  },

  // UNO
  INVALID_UNO_CALL: {
    message: undefined,
  },

  UNO_ALREADY_CALLED: {
    message: undefined,
  },

  // Cut
  INVALID_CUT_CALL: {
    message: undefined,
  },

  CAN_NOT_SELF_CUT: {
    message: undefined,
  },
};
