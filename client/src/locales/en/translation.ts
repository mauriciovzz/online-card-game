export const en = {
  common: {
    return: "Return",
    save: "Save Changes",
    lang: "ES",
  },

  user: {
    name: {
      label: "Name",
      placeholder: "The name is...",
      finishUpdate: "Finish updating your name",
    },
  },

  room: {
    name: "Room name",
    turnDuration: "Turn duration",
    numPlayers: "Players",
    members: "Members",
    create: "Create a room",
    join: "Join a room",
    new: "New room",
    startGame: "Start Game",
    update: "Update room",
    empty: "No rooms available",
    notification: {
      updated: "Room updated",
      capacityUpdated: "Players updated",
      userKickedOut: "User kicked out",
      kickedOut: "Kicked out from room",
    },
  },

  rules: {
    title: "Rules",
    mirror: {
      title: "Mirror",
      description: "Play same number and color card twice.",
    },
    stair: {
      title: "Stair",
      description:
        "Play number cards in increasing order, any color.",
    },
    stack: {
      title: "Stack",
      description: "Action card's effects combine.",
    },
  },

  chat: {
    start: "Chat start",
    newMessages: "New Messages",
  },

  errors: {
    common: {
      empty: "Can't be empty",
    },
    name: {
      taken: "Name already in use",
      maxLength: "Max length is 10",
    },
    room: {
      maxLength: "Max length is 15",
      notFound: "Room not found",
      isFull: "The room is full",
      capacityConflict: "Too many players for this limit",
      playerNotFOund: "Player not found",
      notAdmin: "Request denied",
    },
  },
} as const;
