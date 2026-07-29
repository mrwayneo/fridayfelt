import {
  TOURNAMENT_SCHEMA_VERSION,
  type BlindLevel,
  type BlindStructure,
  type Tournament,
  type TournamentCommand,
  type TournamentStatus,
  type TournamentTransition,
} from "./types";

export interface CreateTournamentInput {
  id: string;
  name: string;
  startingStack: number;
  structure: BlindStructure;
  now: number;
}

function assertStructure(structure: BlindStructure): void {
  if (structure.levels.length === 0) {
    throw new Error("A tournament requires at least one blind level.");
  }

  for (const level of structure.levels) {
    if (!Number.isInteger(level.durationMs) || level.durationMs <= 0) {
      throw new Error(`Level ${level.id} must have a positive duration.`);
    }

    if (
      level.kind === "play" &&
      (!Number.isInteger(level.smallBlind) ||
        !Number.isInteger(level.bigBlind) ||
        level.smallBlind <= 0 ||
        level.bigBlind <= level.smallBlind)
    ) {
      throw new Error(`Level ${level.id} has invalid blinds.`);
    }
  }
}

function levelStatus(level: BlindLevel): TournamentStatus {
  return level.kind === "break" ? "break" : "running";
}

export function createTournament(input: CreateTournamentInput): Tournament {
  assertStructure(input.structure);

  if (!Number.isInteger(input.startingStack) || input.startingStack <= 0) {
    throw new Error("Starting stack must be a positive integer.");
  }

  const firstLevel = input.structure.levels[0];

  return {
    schemaVersion: TOURNAMENT_SCHEMA_VERSION,
    id: input.id,
    name: input.name,
    createdAt: input.now,
    updatedAt: input.now,
    startingStack: input.startingStack,
    structure: structuredClone(input.structure),
    runtime: {
      status: "idle",
      currentLevelIndex: 0,
      remainingMs: firstLevel.durationMs,
      targetEndsAt: null,
      startedAt: null,
      updatedAt: input.now,
      revision: 0,
    },
    players: [],
    entries: [],
    eliminations: [],
    results: [],
  };
}

export function getCurrentLevel(tournament: Tournament): BlindLevel {
  return tournament.structure.levels[tournament.runtime.currentLevelIndex];
}

export function getRemainingMs(tournament: Tournament, now: number): number {
  if (tournament.runtime.targetEndsAt === null) {
    return Math.max(0, tournament.runtime.remainingMs);
  }

  return Math.max(0, tournament.runtime.targetEndsAt - now);
}

function moveToLevel(
  tournament: Tournament,
  index: number,
  now: number,
): Tournament {
  const level = tournament.structure.levels[index];
  const wasActive =
    tournament.runtime.status === "running" ||
    tournament.runtime.status === "break";
  const status = wasActive ? levelStatus(level) : tournament.runtime.status;

  return {
    ...tournament,
    updatedAt: now,
    runtime: {
      ...tournament.runtime,
      status,
      currentLevelIndex: index,
      remainingMs: level.durationMs,
      targetEndsAt: wasActive ? now + level.durationMs : null,
      updatedAt: now,
    },
  };
}

function completeTournament(tournament: Tournament, now: number): Tournament {
  return {
    ...tournament,
    updatedAt: now,
    runtime: {
      ...tournament.runtime,
      status: "completed",
      remainingMs: 0,
      targetEndsAt: null,
      updatedAt: now,
    },
  };
}

function withRevision(
  previous: Tournament,
  next: Tournament,
  command: TournamentCommand,
  now: number,
): TournamentTransition {
  if (next === previous) {
    return { state: previous, changed: false, event: null };
  }

  const revision = previous.runtime.revision + 1;
  const state = {
    ...next,
    updatedAt: now,
    runtime: {
      ...next.runtime,
      revision,
      updatedAt: now,
    },
  };

  return {
    state,
    changed: true,
    event: {
      type: command.type,
      occurredAt: now,
      revision,
    },
  };
}

export function transitionTournament(
  tournament: Tournament,
  command: TournamentCommand,
  now: number,
): TournamentTransition {
  let next = tournament;
  const runtime = tournament.runtime;

  switch (command.type) {
    case "START": {
      if (runtime.status !== "idle") break;
      const level = getCurrentLevel(tournament);
      next = {
        ...tournament,
        runtime: {
          ...runtime,
          status: levelStatus(level),
          targetEndsAt: now + runtime.remainingMs,
          startedAt: runtime.startedAt ?? now,
        },
      };
      break;
    }
    case "PAUSE": {
      if (runtime.status !== "running" && runtime.status !== "break") break;
      next = {
        ...tournament,
        runtime: {
          ...runtime,
          status: "paused",
          remainingMs: getRemainingMs(tournament, now),
          targetEndsAt: null,
        },
      };
      break;
    }
    case "RESUME": {
      if (runtime.status !== "paused" || runtime.remainingMs <= 0) break;
      next = {
        ...tournament,
        runtime: {
          ...runtime,
          status: levelStatus(getCurrentLevel(tournament)),
          targetEndsAt: now + runtime.remainingMs,
        },
      };
      break;
    }
    case "NEXT_LEVEL": {
      const nextIndex = runtime.currentLevelIndex + 1;
      next =
        nextIndex >= tournament.structure.levels.length
          ? completeTournament(tournament, now)
          : moveToLevel(tournament, nextIndex, now);
      break;
    }
    case "PREVIOUS_LEVEL": {
      if (runtime.currentLevelIndex === 0) break;
      next = moveToLevel(tournament, runtime.currentLevelIndex - 1, now);
      break;
    }
    case "ADD_TIME": {
      if (!Number.isFinite(command.milliseconds)) break;
      const remainingMs = Math.max(
        0,
        getRemainingMs(tournament, now) + Math.trunc(command.milliseconds),
      );
      next = {
        ...tournament,
        runtime: {
          ...runtime,
          remainingMs,
          targetEndsAt:
            runtime.targetEndsAt === null ? null : now + remainingMs,
        },
      };
      break;
    }
    case "RESET": {
      const firstLevel = tournament.structure.levels[0];
      next = {
        ...tournament,
        runtime: {
          status: "idle",
          currentLevelIndex: 0,
          remainingMs: firstLevel.durationMs,
          targetEndsAt: null,
          startedAt: null,
          updatedAt: now,
          revision: runtime.revision,
        },
      };
      break;
    }
  }

  return withRevision(tournament, next, command, now);
}

export function reconcileTournament(
  tournament: Tournament,
  now: number,
): Tournament {
  if (
    tournament.runtime.targetEndsAt === null ||
    (tournament.runtime.status !== "running" &&
      tournament.runtime.status !== "break")
  ) {
    return tournament;
  }

  let reconciled = tournament;
  let levelEnd = tournament.runtime.targetEndsAt;

  while (now >= levelEnd) {
    const nextIndex = reconciled.runtime.currentLevelIndex + 1;

    if (nextIndex >= reconciled.structure.levels.length) {
      return completeTournament(reconciled, now);
    }

    const nextLevel = reconciled.structure.levels[nextIndex];
    levelEnd += nextLevel.durationMs;
    reconciled = {
      ...reconciled,
      updatedAt: now,
      runtime: {
        ...reconciled.runtime,
        status: levelStatus(nextLevel),
        currentLevelIndex: nextIndex,
        remainingMs: Math.max(0, levelEnd - now),
        targetEndsAt: levelEnd,
        updatedAt: now,
      },
    };
  }

  return {
    ...reconciled,
    runtime: {
      ...reconciled.runtime,
      remainingMs: levelEnd - now,
    },
  };
}
