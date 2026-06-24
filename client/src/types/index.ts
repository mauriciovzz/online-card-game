import type { Card } from "@shared/types";

/* CARDS */

export type SvgCardsMap = Record<string, string>;

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

export type LobbyView = "main" | "edit";
export type HomeView = "list" | "create";

/* GAME */

export type Items = Record<string, Card[]>;
