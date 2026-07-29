import type { BlindLevel, BlindStructure } from "@friday-felt/tournament-domain";

export const MINUTE = 60_000;

const baseLevels: BlindLevel[] = [
  { id: "level-1", kind: "play", durationMs: 15 * MINUTE, smallBlind: 25, bigBlind: 50 },
  { id: "level-2", kind: "play", durationMs: 15 * MINUTE, smallBlind: 50, bigBlind: 100 },
  { id: "level-3", kind: "play", durationMs: 15 * MINUTE, smallBlind: 75, bigBlind: 150 },
  { id: "break-1", kind: "break", durationMs: 5 * MINUTE, label: "First break" },
  { id: "level-4", kind: "play", durationMs: 15 * MINUTE, smallBlind: 100, bigBlind: 200 },
  { id: "level-5", kind: "play", durationMs: 15 * MINUTE, smallBlind: 150, bigBlind: 300 },
  { id: "level-6", kind: "play", durationMs: 15 * MINUTE, smallBlind: 200, bigBlind: 400 },
  { id: "level-7", kind: "play", durationMs: 15 * MINUTE, smallBlind: 300, bigBlind: 600 },
  { id: "level-8", kind: "play", durationMs: 15 * MINUTE, smallBlind: 400, bigBlind: 800 },
];

function createPreset(
  id: string,
  name: string,
  playMinutes: number,
  breakMinutes = 5,
): BlindStructure {
  return {
    id,
    name,
    version: 1,
    levels: baseLevels.map((level) => ({
      ...level,
      durationMs:
        (level.kind === "break" ? breakMinutes : playMinutes) * MINUTE,
    })),
  };
}

export const structurePresets: BlindStructure[] = [
  createPreset("friday-felt-quick", "Quick Night", 10),
  createPreset("friday-felt-classic", "Friday Felt Classic", 15),
  createPreset("friday-felt-relaxed", "Relaxed Game", 20),
  createPreset("friday-felt-deep", "Deep Stack", 25, 10),
];

export const fridayFeltStructure = structurePresets[1];

export function cloneStructure(structure: BlindStructure): BlindStructure {
  return {
    ...structure,
    levels: structure.levels.map((level) => ({ ...level })),
  };
}

export function withPlayDuration(
  structure: BlindStructure,
  minutes: number,
): BlindStructure {
  return {
    ...cloneStructure(structure),
    id: `${structure.id}-${minutes}-minutes`,
    name: `${structure.name} · ${minutes} min`,
    levels: structure.levels.map((level) =>
      level.kind === "play"
        ? { ...level, durationMs: minutes * MINUTE }
        : { ...level },
    ),
  };
}

export function structureDuration(structure: BlindStructure): number {
  return structure.levels.reduce((total, level) => total + level.durationMs, 0);
}

