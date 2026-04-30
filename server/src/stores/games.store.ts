import { Game, Turn } from "@shared/types";

const games = new Map<string, Game>();
const timers = new Map<string, NodeJS.Timeout>();
const turns = new Map<string, Turn>();

export { games, timers, turns };
