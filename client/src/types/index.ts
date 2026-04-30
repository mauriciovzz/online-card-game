/* CHAT */

export interface Typer {
  userId: string;
}

export interface MessageCheck {
  playerId: string;
  isRead: boolean;
}

export interface ReadUpdate {
  playerId: string;
  lastReadCreatedAt: number;
}

/* PAGES */

export type View = "main" | "edit";
