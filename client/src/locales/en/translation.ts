export const en = {
  common: {
    return: "Return",
    save: "Save Changes",
    lang: "ES",
    you: "You",
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
    seats: {
      title: "Seats",

      selectionTitle: "Seats selection",
      selectionDescription: `A room can have from 2 to 4 seats for players.  
        Open one clicking +, and then choose it's type.
        Close one clicking on ⊖.`,

      updateTitle: "Seats update",
      updateDescription: `A room can have from 2 to 4 seats for players.  
        Open one clicking +, and then choose it's type.
        Close one clicking on ⊖.
        Kick a player from the room clicking ⊗.`,

      human: "Human",
      humanDescription: "The seats is for humans",
      ai: "AI",
      aiDescription: "The seats is for an AI",
    },
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
      cancelled: "Match cancelled",
    },
    settings: "Settings",
    leave: "Leave room",
    score: "Scores",
  },

  rules: {
    title: "Rules",
    mirror: {
      title: "Mirror",
      description:
        "Play cards with same number and color twice.",
    },
    stair: {
      title: "Stair",
      description: "Play number cards in increasing order.",
    },
    stack: {
      title: "Stack",
      description:
        "Action card's effects (+2, +4, 🚫) combine.",
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
      gameStarted: "The game has already started",
      isFull: "The room is full",
      playerNotFound: "Player not found",
      notAdmin: "Request denied",
      notEnoughtPlayers: "Not enought players",
      notEnoughtSeats: "Need at least 2 members",
      seatTaken: "Seat taken",
      notInRoom: "You are not in this room",
      serverError: "Server error",
    },
    game: {
      notYourTurn: "Not your turn",
    },
  },
} as const;
