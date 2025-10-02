export interface Player {
  id: string;
  name: string;
  cards: string[]
}

export interface GameRoom {
  state: "waiting" | "playing"
  cardDeck: string[];
  pile: string[];
  numPlayers:  1 | 2 | 3 | 4;
  players: Player[];
  currentTurn: number;
  currentColor?: "R" | "Y" | "G" | "B";
  timer?: NodeJS.Timeout;
}