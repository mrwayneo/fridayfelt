export const TOURNAMENT_SCHEMA_VERSION = 1 as const;

export type TournamentStatus =
  | "idle"
  | "running"
  | "paused"
  | "break"
  | "completed";

interface BlindLevelBase {
  id: string;
  durationMs: number;
  label?: string;
}

export interface PlayLevel extends BlindLevelBase {
  kind: "play";
  smallBlind: number;
  bigBlind: number;
  ante?: number;
}

export interface BreakLevel extends BlindLevelBase {
  kind: "break";
}

export type BlindLevel = PlayLevel | BreakLevel;

export interface BlindStructure {
  id: string;
  name: string;
  version: number;
  levels: BlindLevel[];
}

export interface TournamentRuntime {
  status: TournamentStatus;
  currentLevelIndex: number;
  remainingMs: number;
  targetEndsAt: number | null;
  startedAt: number | null;
  updatedAt: number;
  revision: number;
}

export interface Tournament {
  schemaVersion: typeof TOURNAMENT_SCHEMA_VERSION;
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  startingStack: number;
  structure: BlindStructure;
  runtime: TournamentRuntime;
  players: unknown[];
  entries: unknown[];
  eliminations: unknown[];
  results: unknown[];
}

export type TournamentCommand =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT_LEVEL" }
  | { type: "PREVIOUS_LEVEL" }
  | { type: "ADD_TIME"; milliseconds: number }
  | { type: "RESET" };

export interface TournamentTransition {
  state: Tournament;
  changed: boolean;
  event: {
    type: TournamentCommand["type"];
    occurredAt: number;
    revision: number;
  } | null;
}
