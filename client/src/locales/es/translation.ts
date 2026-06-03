export const es = {
  common: {
    return: "Regresar",
    save: "Guardar Cambios",
    lang: "EN",
  },

  user: {
    name: {
      label: "Nombre",
      placeholder: "El nombre es...",
      finishUpdate: "Termina de actualizar tu nombre",
    },
  },

  room: {
    name: "Nombre de la Sala",
    turnDuration: "Duración del turno",
    numPlayers: "Jugadores",
    members: "Miembros",
    create: "Crear Sala",
    join: "Unirse a una sala",
    new: "Nueva Sala",
    start: "Iniciar",
    edit: "Editar",
    update: "Actualizar Sala",
    empty: "No hay salas disponibles",
    notification: {
      left: "Sala abandonada",
      updated: "Sala actualizada",
      capacityUpdated: "Jugadores actualizado",
      userKickedOut: "Jugador expulsado",
      kickedOut: "Expulsado de la sala",
    },
    settings: "Ajustes",
    leave: "Abandonar sala",
  },

  rules: {
    title: "Reglas",
    mirror: {
      title: "Espejito",
      description:
        "Juega cartas que tengan el mismo número y color dos veces.",
    },
    stair: {
      title: "Escalerita",
      description:
        "Juega cartas numéricas en orden ascendente, de cualquier color.",
    },
    stack: {
      title: "Stack",
      description:
        "Los efectos de las cartas de acción se combinan.",
    },
  },

  game: {
    turn: "Turno",
    myTurn: "Tu turno",
    draw: "cargar",
    clientWon: "Ganaste la partida!",
    someoneWon: "{{name}} gano la partida!",
    dontStack: "No responder",
    cut: "{{cutter}} corto a {{cutted}}!",
    cutter: "Cortaste a {{name}}!",
    cutted: "{{name}} te corto! (+2 cartas)",
    calledUno: "Gritaste UNO!",
    unoCalled: "{{name}} grito UNO!",
    playerQuit: "{{name}} abandono el juego",
    timeout: "Se acabo el tiempo",
    timeoutWithCard: "Se acabo el tiempo (+1 carta)",
    skipEffect: "Perdiste tu turno!",
    drawEffect: "Carga {{cards}} cartas!",
  },

  chat: {
    start: "Inicio del chat",
    newMessages: "Nuevos mensajes",
  },

  errors: {
    common: {
      empty: "No puede estar vacío",
    },
    name: {
      taken: "Nombre en uso",
      maxLength: "Máximo 10 caracteres",
    },
    room: {
      maxLength: "Máximo 15 caracteres",
      isFull: "La sala esta llena",
      capacityConflict:
        "Demasiados jugadores para este límite",
      playerNotFound: "Jugador no encontrado",
      notAdmin: "Solicitud denegada",
      notEnoughtPlayers: "No hay jugadores suficientes",
      notInRoom: "No forma parte de la sala",
      serverError: "Error del servidor",
    },
    game: {
      notYourTurn: "No es tu turno",
    },
  },
} as const;
