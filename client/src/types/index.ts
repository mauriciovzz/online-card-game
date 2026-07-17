import type { Card } from "@shared/types";
import type { IconProps } from "@tabler/icons-react";

/* CONTEXT */

export interface MainLayoutContextType {
  layoutHeight: number;
}

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

export type BoardPosition =
  "top" | "bottom" | "left" | "right";

/* GAME */

export type Items = Record<string, Card[]>;

/* SEATS */

export interface Action {
  icon?: React.FC<IconProps>;
  corner?: boolean;
  onClick: () => void;
}
