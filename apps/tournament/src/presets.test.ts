import { describe, expect, it } from "vitest";
import {
  MINUTE,
  structurePresets,
  withPlayDuration,
} from "./presets";

describe("Friday Felt structure presets", () => {
  it("provides quick, classic, relaxed and deep-stack round lengths", () => {
    const durations = structurePresets.map((structure) => {
      const firstPlay = structure.levels.find((level) => level.kind === "play");
      return firstPlay ? firstPlay.durationMs / MINUTE : 0;
    });

    expect(durations).toEqual([10, 15, 20, 25]);
  });

  it("can override every play round without changing break duration", () => {
    const classic = structurePresets[1];
    const adjusted = withPlayDuration(classic, 20);
    const playDurations = adjusted.levels
      .filter((level) => level.kind === "play")
      .map((level) => level.durationMs);
    const breakLevel = adjusted.levels.find((level) => level.kind === "break");

    expect(playDurations).toEqual(Array(8).fill(20 * MINUTE));
    expect(breakLevel?.durationMs).toBe(5 * MINUTE);
    expect(classic.levels[0].durationMs).toBe(15 * MINUTE);
  });
});
