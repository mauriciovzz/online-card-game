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
    start: "Start",
    edit: "Edit",
    update: "Update room",
    empty: "No rooms available",
    notification: {
      left: "Room left",
      updated: "Room updated",
      capacityUpdated: "Players updated",
      userKickedOut: "User kicked out",
      kickedOut: "Kicked out from room",
    },
    settings: "Settings",
    leave: "Leave room",
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

  game: {
    turn: "Turn",
    myTurn: "Your turn",
    draw: "draw",
    clientWon: "you won the match",
    someoneWon: "{{name}} won the match",
    dontStack: "Don't respond",
    cut: "{{cutter}} cut {{cutted}}!",
    cutter: "You cut {{name}}!",
    cutted: "{{name}} cut you! (+2 cards)",
    calledUno: "You yelled UNO!",
    unoCalled: "{{name}} yelled UNO!",
    playerQuit: "{{name}} left the game",
    timeout: "Timeout",
    timeoutWithCard: "Timeout (+1 card)",
    skipEffect: "Turn skipped!",
    drawEffect: "Draw {{cards}} cards!",
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
      isFull: "The room is full",
      capacityConflict: "Too many players for this limit",
      playerNotFound: "Player not found",
      notAdmin: "Request denied",
      notEnoughtPlayers: "Not enought players",
      notInRoom: "You are not in this room",
      serverError: "Server error",
    },
    game: {
      notYourTurn: "Not your turn",
    },
  },
} as const;
