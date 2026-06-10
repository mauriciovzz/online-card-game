export const es = {
  common: {
    return: "Regresar",
    save: "Guardar Cambios",
    lang: "EN",
    you: "Tú",
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
    members: {
      title: "Miembros",
      descriptionTitle: "Selección de miembros",
      description: `Una sala puede tener de 2 a 4 miembros.  
        Incluye uno haciendo clic en + y luego selecciona
        su tipo. 
        Elimina uno haciendo clic x.`,
      human: "Humano",
      humanDescription:
        "El miembro es otra persona en línea.",
      ai: "IA",
      aiDescription: "El miembro es IA.",
    },
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
      capacityUpdated: "Jugadores actualizados",
      userKickedOut: "Jugador expulsado",
      kickedOut: "Expulsado de la sala",
    },
    settings: "Ajustes",
    leave: "Salir",
  },

  rules: {
    title: "Reglas",
    mirror: {
      title: "Espejito",
      description:
        "Juega cartas numéricas iguales dos veces.",
    },
    stair: {
      title: "Escalerita",
      description:
        "Juega cartas numéricas en orden ascendente.",
    },
    stack: {
      title: "Combo",
      description: "Los efectos (+2, +4, 🚫) se combinan.",
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
    timeout: "Se acabó el tiempo",
    timeoutWithCard: "Se acabó el tiempo (+1 carta)",
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
