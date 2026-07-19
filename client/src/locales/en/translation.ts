export const en = {
  common: {
    return: "Return",
    save: "Save Changes",
    lang: "EN",
    you: "You",
    rotate: "Rotate your device",
    rotateDesc:
      "This game is designed to be played in portrait mode on smaller screens",
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
      humanDescription: "The seat is for humans",
      bot: "Bot",
      botDescription: "The seat is for a bot",
    },
    create: "Create a room",
    join: "Join a room",
    new: "New room",
    start: "Start",
    edit: "Edit",
    update: "Edit room",
    empty: "No rooms available",
    notification: {
      left: "Room left",
      updated: "Room updated",
      capacityUpdated: "Players updated",
      userKickedOut: "User kicked out",
      kickedOut: "Kicked out from room",
      cancelled: "Match cancelled",
      scoresReset: "Scores reset",
    },
    settings: "Settings",
    leave: "Leave room",
    scores: "Scores",
  },

  rules: {
    title: "Rules",
    mirror: {
      title: "Mirror",
      description: "Play cards with same number and color twice.",
      longDescription:
        "After playing a number card, you may play the same card again, only if their colors are the same (for example, yellow 4 → yellow 4).",
    },
    stair: {
      title: "Stair",
      description: "Play number cards in increasing order.",
      longDescription:
        "After playing a number card, you may continue playing consecutive ascending number cards, even if their colors are different (for example, 4 → 5 → 6).",
    },
    stack: {
      title: "Stack",
      description: "Action card's effects (+2, +4, 🚫) combine.",
      longDescription:
        "Draw and Skip cards can be stacked. Instead of taking the penalty, a player may respond with another compatible card, passing the accumulated penalty to the next player.",
    },
  },

  game: {
    turn: "Turn",
    myTurn: "Your turn",
    draw: "draw",
    continue: "continue",
    clientWon: "You won the match!",
    someoneWon: "{{name}} won the match!",
    points: "points",
    returningLobby: "Returning to lobby in...",
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

  chat: { start: "Chat start", newMessages: "New Messages" },

  help: {
    title: "Help",
    index: {
      devBy: "Developed by Mauricio Velázquez",
      tools: "with React, TypeScript, Mantine and Socket.IO",
    },
    basics: {
      title: "Uno Basics",
      goal: "The goal of the game is to be the first player to play all of the cards in their hand.",
      turnHead: "Taking Your Turn",
      turnInst:
        "On your turn, you may play one card that matches the top card of the discard pile by:",
      matchCriteria: [
        "Color (red, blue, green or yellow)",
        "Number (from 0 to 9)",
        "Symbol (action card)",
      ],
      wildCards: "Wild cards can be played at any time.",
      drawInst:
        "If you cannot or choose not to play, draw one card from the deck.",
      unoHeading: "Declaring UNO",
      unoInst:
        "When you have only one card left, press the 1 button to declare UNO. If another player cuts you before you declare UNO, you will be penalised with two cards.",
    },
    cards: {
      heading: "Cards",
      numberTitle: "Number",
      numberDescription: "Basic cards that go from 0 to 9.",
      skipTitle: "Skip",
      skipDescription: "The next player loses their turn.",
      reverseTitle: "Reverse",
      reverseDescription:
        "Reverses the direction of play. In a two-player game, it works like a Skip card.",
      drawTwoTitle: "Draw Two",
      drawTwoDescription:
        "The next player draws two cards and loses their turn.",
      wildTitle: "Wild",
      wildDescription:
        "Can be played at any time. The player who plays it chooses the new active color.",
      wildDrawFourTitle: "Wild Draw Four",
      wildDrawFourDescription:
        "Changes the active color. The next player draws four cards and loses their turn.",
    },
    points: {
      heading: "Points",
      roundEnd: "The round ends when a player has no cards left.",
      pointsInst:
        "The winner receives points equal to the value of all cards remaining in the other player's hands:",
      pointValues: [
        "Number cards: Face value",
        "Skip, Reverse and Draw Two: 20 points",
        "Wild and Wild Draw Four: 50 points",
      ],
      scoreboard:
        "The room scoreboard keeps track of total points and games won by each player.",
    },
    rules: {
      heading: "House Rules",
      description:
        "Rooms can have optional rules that change how the game is played.",
    },
    home: {
      heading: "Home Page",
      description:
        "The Home screen lets you update your username, join an existing room or create a new one.",
      nameTitle: "Username",
      nameDesc:
        "A unique username is generated automatically when you open the game. Select the edit button to change it.",
      roomsTitle: "Available Rooms",
      roomsDesc: "Each room displays:",
      roomsCriteria: ["Room name", "Enabled house rules", "Available seats"],
      roomsAction: "Select a room to join it.",
      seatsTitle: "Seat Indicators",
      seatsDesc: "Each square represents one possible player.",
      seatsCriteria: [
        "Gray: Seat disabled",
        "Colored outline: Seat available",
        "Filled square: Seat occupied",
      ],
    },
    lobby: {
      heading: "Lobby Page",
      description: "The Lobby is where players wait before a game begins.",
      InfoTitle: "Room Information",
      infoDesc:
        "The lobby displays the room's turn duration and enabled house rules.",
      seatsTitle: "Seats",
      seatsDesc: "Each seat shows the player occupying it.",
      scoreTitle: "Scoreboard",
      scoreDesc:
        "The scoreboard tracks each player's points (⭐) and wins (🏆) within the room. It also highlights the last player who won a game with a crown (👑).",
    },
    game: {
      heading: "Game Page",
      seatsTitle: "Player Seats",
      seatsDesc: "Each player seat shows:",
      seatsCriteria: [
        "Username",
        "Cards remaining",
        "UNO status",
        "Cut button (✂\uFE0E)",
      ],
      turn: "The current player's panel is highlighted.",
      pileTitle: "Discard Pile",
      pileDesc: "The center pile displays:",
      pileCriteria: [
        "The last card played",
        "The current direction of play",
        "The active color",
      ],
      playTitle: "Playing Cards",
      playDesc:
        "Drag cards from your hand and drop into the discard pile to play them.",
      borderDesc:
        "The dotted outline around the pile indicates whether the selected card can be played. Green indicates a valid move and red an invalid one.",
    },
    buttons: {
      heading: "Game Buttons",
      drawTitle: "Draw",
      drawDesc:
        "In your turn you draw one card from the deck when you can't or don't want to play.",
      contTitle: "Continue",
      contDesc:
        "Some house rules allow multiple plays during the same turn. Press Continue when you are finished playing.",
      unoTitle: "1",
      unoDesc:
        "When you have only one card left, press the 1 button to declare UNO. If another player calls you out before you declare UNO, you will draw two cards.",
      dontTitle: "Don't Respond",
      dontDesc:
        "When stack is on and an stackable action card is played against you, you may respond with another compatible card. Press Don't Respond to accept the penalty instead.",
    },
    settings: {
      heading: "Settings",
      desc: "The Settings menu is available in both the Lobby and the Game. From here you can:",
      actions: [
        "Open this Help guide",
        "Switch the language between English and Spanish",
        "Switch between light and dark mode",
        "Leave the room",
      ],
      host: "If you are the room host during a game, you can also return everyone to the lobby.",
    },
    install: {
      heading: "Install the App",
      android: {
        heading: "Android (Chrome)",
        steps: [
          "Open the game in Google Chrome.",
          "Tap the ⋮ (three dots) menu in the top-right corner.",
          'Select "Install app" or "Add to Home screen".',
          'Tap "Install" to confirm.',
          "The game will be added to your home screen and can be launched like any other app.",
        ],
        tips: "On some Android devices, Chrome may automatically display an Install banner when the app is available.",
      },
      ios: {
        heading: "iPhone & iPad (Safari)",
        steps: [
          "Open the game in Safari.",
          "Tap the Share button (the square with an upward arrow).",
          'Scroll down and tap "Add to Home Screen".',
          "Optionally, edit the app name.",
          'Tap "Add". The game will appear on your home screen and can be opened like a native app.',
        ],
        tips: "Installing the app on iOS only works in Safari.",
      },
    },
  },

  errors: {
    common: { empty: "Can't be empty" },
    name: { taken: "Name already in use", maxLength: "Max length is 10" },
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
    game: { notYourTurn: "Not your turn" },
  },
} as const;
