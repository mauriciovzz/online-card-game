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
    seats: {
      title: "Asientos",

      selectionTitle: "Selección de asientos",
      selectionDescription: `Una sala puede tener de 2 a 4 asientos para jugadores.  
        Abre uno haciendo clic en + y luego selecciona su tipo. 
        Cierra uno haciendo clic en ⊖.`,

      updateTitle: "Actualizacion de asientos",
      updateDescription: `Una sala puede tener de 2 a 4 asientos para jugadores.  
        Abre uno haciendo clic en + y luego selecciona su tipo.
        Cierra uno haciendo clic en ⊖.
        Saca a un jugador de la sala haciendo clic en ⊗.`,

      human: "Humano",
      humanDescription: "El asiento es para humanos",
      ai: "IA",
      aiDescription: "El asiento es para una IA",
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
      cancelled: "Partida cancelada",
    },
    settings: "Ajustes",
    leave: "Salir",
    scores: "Puntuaciones",
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
      gameStarted: "El juego ya ha iniciado",
      isFull: "La sala esta llena",
      playerNotFound: "Jugador no encontrado",
      notAdmin: "Solicitud denegada",
      notEnoughtPlayers: "No hay jugadores suficientes",
      notEnoughtSeats: "Se necesitan minimo 2 miembros",
      seatTaken: "El asiento esta ocupado",
      notInRoom: "No forma parte de la sala",
      serverError: "Error del servidor",
    },
    game: {
      notYourTurn: "No es tu turno",
    },
  },
} as const;
