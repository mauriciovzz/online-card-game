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
    startGame: "Iniciar Partida",
    update: "Actualizar Sala",
    empty: "No hay salas disponibles",
    notification: {
      updated: "Sala actualizada",
      kickedOut: "Removido de la sala",
    },
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
      notFound: "Sala no encontrada",
      isFull: "La sala esta llena",
      capacityConflict:
        "Demasiados jugadores para este límite",
      playerNotFOund: "Jugador no encontrado",
    },
  },
} as const;
