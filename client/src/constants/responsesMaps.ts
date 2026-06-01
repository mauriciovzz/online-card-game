export const ERRORS_MAP: Record<string, string> = {
  NAME_EMPTY: "errors.name.empty",
  USER_MAX_LENGTH: "errors.name.maxLength",
  NAME_TAKEN: "errors.name.taken",

  ROOM_MAX_LENGTH: "errors.room.maxLength",
  ROOM_FULL: "errors.room.isFull",
  NOT_ENOUGHT_PLAYERS: "errors.room.notEnoughtPlayers",
  PLAYER_NOT_FOUND: "errors.room.playerNotFound",

  NOT_IN_ROOM: "errors.roon.notInRoom",
  NOT_ADMIN: "errors.room.notAdmin",

  SERVER_ERROR: "errors.room.serverError",
  ROOM_NOT_FOUND: "errors.room.serverError",
  GAME_NOT_FOUND: "errors.room.serverError",
  TURN_NOT_FOUND: "errors.room.serverError",

  NOT_YOUR_TURN: "errors.game.notYourTurn",
};

export const MESSAGES_MAP: Record<string, string> = {
  ROOM_UPDATED: "room.notification.updated",
  CAPACITY_UPDATED: "room.notification.capacityUpdated",
  USER_KICKED_OUT: "room.notification.userKickedOut",
  KICKED_OUT: "room.notification.kickedOut",
};
