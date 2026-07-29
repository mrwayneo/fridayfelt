import type { BlindStructure } from "@friday-felt/tournament-domain";

const MINUTE = 60_000;

export const fridayFeltStructure: BlindStructure = {
  id: "friday-felt-family",
  name: "Friday Night Poker Tour",
  version: 1,
  levels: [
    { id: "level-1", kind: "play", durationMs: 15 * MINUTE, smallBlind: 25, bigBlind: 50 },
    { id: "level-2", kind: "play", durationMs: 15 * MINUTE, smallBlind: 50, bigBlind: 100 },
    { id: "level-3", kind: "play", durationMs: 15 * MINUTE, smallBlind: 75, bigBlind: 150 },
    { id: "break-1", kind: "break", durationMs: 5 * MINUTE, label: "First break" },
    { id: "level-4", kind: "play", durationMs: 15 * MINUTE, smallBlind: 100, bigBlind: 200 },
    { id: "level-5", kind: "play", durationMs: 15 * MINUTE, smallBlind: 150, bigBlind: 300 },
    { id: "level-6", kind: "play", durationMs: 15 * MINUTE, smallBlind: 200, bigBlind: 400 },
    { id: "level-7", kind: "play", durationMs: 15 * MINUTE, smallBlind: 300, bigBlind: 600 },
    { id: "level-8", kind: "play", durationMs: 15 * MINUTE, smallBlind: 400, bigBlind: 800 },
  ],
};

