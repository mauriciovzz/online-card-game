export const es = {
  common: {
    return: "Volver",
    save: "Guardar Cambios",
    lang: "ES",
    you: "Tú",
    rotate: "Gira tu dispositivo",
    rotateDesc:
      "Este juego está diseñado para jugarse en modo vertical en pantallas pequeñas",
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
      bot: "Bot",
      botDescription: "El asiento es para un bot",
    },
    create: "Crear Sala",
    join: "Unirse a una sala",
    new: "Nueva Sala",
    start: "Iniciar",
    edit: "Editar",
    update: "Editar Sala",
    empty: "No hay salas disponibles",
    notification: {
      left: "Sala abandonada",
      updated: "Sala actualizada",
      capacityUpdated: "Jugadores actualizados",
      userKickedOut: "Jugador expulsado",
      kickedOut: "Expulsado de la sala",
      cancelled: "Partida cancelada",
      scoresReset: "Puntuaciones reestablecidas",
    },
    settings: "Ajustes",
    leave: "Salir",
    scores: "Puntuaciones",
  },

  rules: {
    title: "Reglas",
    mirror: {
      title: "Espejito",
      description: "Juega cartas numéricas iguales dos veces.",
      longDescription:
        "Después de jugar una carta numérica, puedes jugar la misma carta otra vez, solo si sus colores son los mismos (por ejemplo, 4 amarillo → 4 amarillo).",
    },
    stair: {
      title: "Escalerita",
      description: "Juega cartas numéricas en orden ascendente.",
      longDescription:
        "Después de jugar una carta numérica, puedes continuar jugando cartas numéricas consecutivas ascendentes, incluso si sus colores son diferentes (por ejemplo, 4 → 5 → 6).",
    },
    stack: {
      title: "Acumular",
      description: "Los efectos (+2, +4, 🚫) se combinan.",
      longDescription:
        "Las cartas de Cargar y Saltar se pueden acumular. En lugar de recibir la penalización, un jugador puede responder con otra carta compatible, pasando la penalización acumulada al siguiente jugador.",
    },
  },

  game: {
    turn: "Turno",
    myTurn: "Tu turno",
    draw: "cargar",
    continue: "continuar",
    clientWon: "Ganaste la partida!",
    someoneWon: "{{name}} gano la partida!",
    points: "puntos",
    returningLobby: "Regresando a la sala de espera en...",
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

  chat: { start: "Inicio del chat", newMessages: "Nuevos mensajes" },

  help: {
    title: "Ayuda",
    index: {
      devBy: "Desarrollado por Mauricio Velázquez",
      tools: "utilizando React, TypeScript, Mantine y Socket.IO",
    },
    basics: {
      title: "Conceptos Básicos de Uno",
      goal: "El objetivo del juego es ser el primer jugador en jugar todas las cartas de su mano.",
      turnHead: "Tu Turno",
      turnInst:
        "En tu turno, puedes jugar una carta que coincida con la carta superior de la pila de descarte por:",
      matchCriteria: [
        "Color (rojo, azul, verde o amarillo)",
        "Número (del 0 al 9)",
        "Símbolo (carta de acción)",
      ],
      wildCards: "Las cartas comodín se pueden jugar en cualquier momento.",
      drawInst: "Si no puedes o eliges no jugar, carga una carta del mazo.",
      unoHeading: "Declarar UNO",
      unoInst:
        "Cuando te quede una sola carta, presiona el botón 1 para declarar UNO. Si otro jugador te corta antes de declarar UNO, se te penalizara con dos cartas.",
    },
    cards: {
      heading: "Cartas",
      numberTitle: "Número",
      numberDescription: "Cartas básicas que van del 0 al 9.",
      skipTitle: "Salto",
      skipDescription: "El siguiente jugador pierde su turno.",
      reverseTitle: "Reversa",
      reverseDescription:
        "Invierte la dirección del juego. En una partida de dos jugadores, funciona como una carta de Salto.",
      drawTwoTitle: "Carga Dos",
      drawTwoDescription:
        "El siguiente jugador carga dos cartas y pierde su turno.",
      wildTitle: "Comodín",
      wildDescription:
        "Se puede jugar en cualquier momento. El jugador que la juega elige el nuevo color activo.",
      wildDrawFourTitle: "Comodín Carga Cuatro",
      wildDrawFourDescription:
        "Cambia el color activo. El siguiente jugador carga cuatro cartas y pierde su turno.",
    },
    points: {
      heading: "Puntos",
      roundEnd: "La ronda termina cuando a un jugador no le quedan cartas.",
      pointsInst:
        "El ganador recibe puntos iguales al valor de todas las cartas restantes en las manos de los otros jugadores:",
      pointValues: [
        "Cartas numéricas: Valor nominal",
        "Salto, Reversa y Carga Dos: 20 puntos",
        "Comodín y Comodín Carga Cuatro: 50 puntos",
      ],
      scoreboard:
        "El marcador de la sala muestra el total de puntos y partidas ganadas por cada jugador.",
    },
    rules: {
      heading: "Reglas de la Casa",
      description:
        "Las salas pueden tener reglas opcionales que cambian la forma en que se juega.",
    },
    home: {
      heading: "Página de Inicio",
      description:
        "La pantalla de Inicio te permite actualizar tu nombre de usuario, unirte a una sala existente o crear una nueva.",
      nameTitle: "Nombre de Usuario",
      nameDesc:
        "Cuando abres el juego se genera automáticamente un nombre de usuario único. Selecciona el botón de editar para cambiarlo.",
      roomsTitle: "Salas Disponibles",
      roomsDesc: "Cada sala muestra:",
      roomsCriteria: [
        "Nombre de la sala",
        "Reglas activadas",
        "Asientos disponibles",
      ],
      roomsAction: "Selecciona una sala para unirte a ella.",
      seatsTitle: "Indicadores de Asiento",
      seatsDesc: "Cada cuadrado representa un jugador posible.",
      seatsCriteria: [
        "Gris: Asiento desactivado",
        "Contorno de color: Asiento disponible",
        "Cuadrado relleno: Asiento ocupado",
      ],
    },
    lobby: {
      heading: "Página de la Sala de Espera",
      description:
        "La Sala de Espera es donde los jugadores aguardan antes de que comience una partida.",
      InfoTitle: "Información de la Sala",
      infoDesc:
        "La sala de espera muestra la duración del turno de la sala y las reglas activadas.",
      seatsTitle: "Asientos",
      seatsDesc: "Cada asiento muestra al jugador que lo ocupa.",
      scoreTitle: "Tablero de Puntuación",
      scoreDesc:
        "El tablero de puntuación muestra los puntos (⭐) y victorias (🏆) de cada jugador dentro de la sala. También destaca al último jugador que ganó una partida con una corona (👑).",
    },
    game: {
      heading: "Página del Juego",
      seatsTitle: "Asientos de los Jugadores",
      seatsDesc: "Cada asiento de jugador muestra:",
      seatsCriteria: [
        "Nombre de usuario",
        "Cartas restantes",
        "Estado de UNO",
        "Botón de cortar (✂\uFE0E)",
      ],
      turn: "El panel del jugador actual está resaltado.",
      pileTitle: "Pila de Descarte",
      pileDesc: "La pila central muestra:",
      pileCriteria: [
        "La última carta jugada",
        "La dirección actual del juego",
        "El color activo",
      ],
      playTitle: "Jugar Cartas",
      playDesc:
        "Arrastra las cartas de tu mano y suéltalas en la pila de descarte para jugarlas.",
      borderDesc:
        "El contorno punteado alrededor de la pila indica si la carta seleccionada se puede jugar. El verde indica un movimiento válido y el rojo uno inválido.",
    },
    buttons: {
      heading: "Botones del Juego",
      drawTitle: "Cargar",
      drawDesc:
        "En tu turno carga una carta del mazo cuando no puedas o no quieras jugar.",
      contTitle: "Continuar",
      contDesc:
        "Algunas reglas de la casa permiten múltiples jugadas durante el mismo turno. Presiona Continuar cuando hayas terminado de jugar.",
      unoTitle: "1",
      unoDesc:
        "Cuando te quede una sola carta, presiona el botón 1 para declarar UNO. Si otro jugador te descubre antes de declarar UNO, cargaras dos cartas.",
      dontTitle: "No Responder",
      dontDesc:
        "Cuando la regla de acumular está activada y se juega una carta de acción acumulable contra ti, puedes responder con otra carta compatible. Presiona No Responder para aceptar la penalización en su lugar.",
    },
    settings: {
      heading: "Ajustes",
      desc: "El menú de Ajustes está disponible tanto en la Sala de Espera como en el Juego. Desde aquí puedes:",
      actions: [
        "Abrir esta guía de Ayuda",
        "Cambiar el idioma entre inglés y español",
        "Cambiar entre modo claro y oscuro",
        "Salir de la sala",
      ],
      host: "Si eres el anfitrión de la sala durante una partida, también puedes regresar a todos a la sala de espera.",
    },
    install: {
      heading: "Instalar la Aplicación",
      android: {
        heading: "Android (Chrome)",
        steps: [
          "Abre el juego en Google Chrome.",
          "Toca el menú ⋮ (tres puntos) en la esquina superior derecha.",
          'Selecciona "Instalar aplicación" o "Agregar a la pantalla principal".',
          'Pulsa "Instalar" para confirmar.',
          "El juego se añadirá a tu pantalla de inicio y podrás abrirlo como cualquier otra aplicación.",
        ],
        tips: "En algunos dispositivos Android, Chrome mostrará automáticamente un aviso para instalar la aplicación cuando esté disponible.",
      },
      ios: {
        heading: "iPhone y iPad (Safari)",
        steps: [
          "Abre el juego en Safari.",
          "Toca el botón Compartir (el cuadrado con una flecha hacia arriba).",
          'Desplázate hacia abajo y selecciona "Agregar a pantalla de inicio".',
          "Si lo deseas, cambia el nombre de la aplicación.",
          'Pulsa "Agregar". El juego aparecerá en tu pantalla de inicio y podrás abrirlo como una aplicación nativa.',
        ],
        tips: "En iPhone y iPad solo es posible instalar aplicaciones web desde Safari.",
      },
    },
  },

  errors: {
    common: { empty: "No puede estar vacío" },
    name: { taken: "Nombre en uso", maxLength: "Máximo 10 caracteres" },
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
    game: { notYourTurn: "No es tu turno" },
  },
} as const;
