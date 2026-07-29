import { describe, expect, it } from "vitest";
import {
  createTournament,
  getRemainingMs,
  reconcileTournament,
  transitionTournament,
  type BlindStructure,
} from ".";

const SECOND = 1_000;
const MINUTE = 60 * SECOND;

const structure: BlindStructure = {
  id: "friday-felt-main",
  name: "Friday Felt Main Event",
  version: 1,
  levels: [
    {
      id: "level-1",
      kind: "play",
      durationMs: 15 * MINUTE,
      smallBlind: 25,
      bigBlind: 50,
    },
    {
      id: "break-1",
      kind: "break",
      durationMs: 5 * MINUTE,
      label: "First break",
    },
    {
      id: "level-2",
      kind: "play",
      durationMs: 15 * MINUTE,
      smallBlind: 50,
      bigBlind: 100,
    },
  ],
};

function makeTournament(now = 1_000_000) {
  return createTournament({
    id: "event-1",
    name: "Friday Night Poker #1",
    startingStack: 2_100,
    structure,
    now,
  });
}

describe("tournament timer domain", () => {
  it("starts from the first level using a target end time", () => {
    const now = 1_000_000;
    const result = transitionTournament(makeTournament(now), { type: "START" }, now);

    expect(result.changed).toBe(true);
    expect(result.state.runtime.status).toBe("running");
    expect(result.state.runtime.targetEndsAt).toBe(now + 15 * MINUTE);
    expect(result.state.runtime.revision).toBe(1);
  });

  it("derives time remaining without interval drift", () => {
    const now = 1_000_000;
    const running = transitionTournament(
      makeTournament(now),
      { type: "START" },
      now,
    ).state;

    expect(getRemainingMs(running, now + 47 * SECOND)).toBe(
      15 * MINUTE - 47 * SECOND,
    );
  });

  it("persists the exact remaining time when paused and resumed", () => {
    const now = 1_000_000;
    const running = transitionTournament(
      makeTournament(now),
      { type: "START" },
      now,
    ).state;
    const pausedAt = now + 4 * MINUTE;
    const paused = transitionTournament(
      running,
      { type: "PAUSE" },
      pausedAt,
    ).state;

    expect(paused.runtime.status).toBe("paused");
    expect(paused.runtime.remainingMs).toBe(11 * MINUTE);
    expect(paused.runtime.targetEndsAt).toBeNull();

    const resumedAt = pausedAt + 2 * MINUTE;
    const resumed = transitionTournament(
      paused,
      { type: "RESUME" },
      resumedAt,
    ).state;

    expect(resumed.runtime.status).toBe("running");
    expect(resumed.runtime.targetEndsAt).toBe(resumedAt + 11 * MINUTE);
  });

  it("moves into a break and preserves elapsed overflow after sleep", () => {
    const now = 1_000_000;
    const running = transitionTournament(
      makeTournament(now),
      { type: "START" },
      now,
    ).state;
    const reconciled = reconcileTournament(running, now + 17 * MINUTE);

    expect(reconciled.runtime.currentLevelIndex).toBe(1);
    expect(reconciled.runtime.status).toBe("break");
    expect(getRemainingMs(reconciled, now + 17 * MINUTE)).toBe(3 * MINUTE);
    expect(reconciled.runtime.revision).toBe(2);
  });

  it("reconciles across several elapsed levels without timer drift", () => {
    const now = 1_000_000;
    const running = transitionTournament(
      makeTournament(now),
      { type: "START" },
      now,
    ).state;
    const reconciled = reconcileTournament(running, now + 21 * MINUTE);

    expect(reconciled.runtime.currentLevelIndex).toBe(2);
    expect(reconciled.runtime.status).toBe("running");
    expect(getRemainingMs(reconciled, now + 21 * MINUTE)).toBe(14 * MINUTE);
    expect(reconciled.runtime.revision).toBe(3);
  });

  it("can skip levels and reset safely", () => {
    const now = 1_000_000;
    const running = transitionTournament(
      makeTournament(now),
      { type: "START" },
      now,
    ).state;
    const breakState = transitionTournament(
      running,
      { type: "NEXT_LEVEL" },
      now + MINUTE,
    ).state;

    expect(breakState.runtime.status).toBe("break");
    expect(breakState.runtime.currentLevelIndex).toBe(1);

    const reset = transitionTournament(
      breakState,
      { type: "RESET" },
      now + 2 * MINUTE,
    ).state;

    expect(reset.runtime.status).toBe("idle");
    expect(reset.runtime.currentLevelIndex).toBe(0);
    expect(reset.runtime.remainingMs).toBe(15 * MINUTE);
    expect(reset.runtime.targetEndsAt).toBeNull();
  });
});
