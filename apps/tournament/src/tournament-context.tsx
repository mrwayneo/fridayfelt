import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createTournament,
  getRemainingMs,
  reconcileTournament,
  transitionTournament,
  type Tournament,
  type TournamentCommand,
} from "@friday-felt/tournament-domain";
import { fridayFeltStructure } from "./presets";
import {
  deleteTournament,
  loadSettings,
  loadTournament,
  saveSettings,
  saveTournament,
  type TimerSettings,
} from "./storage";

interface TournamentContextValue {
  tournament: Tournament | null;
  now: number;
  remainingMs: number;
  settings: TimerSettings;
  create: (name: string, startingStack: number) => void;
  command: (command: TournamentCommand) => void;
  clear: () => void;
  updateSettings: (settings: TimerSettings) => void;
  playAlert: (kind?: "warning" | "level") => void;
}

const TournamentContext = createContext<TournamentContextValue | null>(null);

function soundAlert(kind: "warning" | "level"): void {
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = kind === "level" ? 660 : 440;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.48);
  oscillator.addEventListener("ended", () => void context.close());
}

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournament, setTournament] = useState<Tournament | null>(() => {
    const stored = loadTournament();
    return stored ? reconcileTournament(stored, Date.now()) : null;
  });
  const [now, setNow] = useState(Date.now);
  const [settings, setSettings] = useState<TimerSettings>(loadSettings);
  const warnedRevision = useRef<number | null>(null);

  const playAlert = useCallback(
    (kind: "warning" | "level" = "level") => {
      if (settings.soundEnabled) soundAlert(kind);
    },
    [settings.soundEnabled],
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const tick = Date.now();
      setNow(tick);
      setTournament((current) => {
        if (!current) return current;
        const reconciled = reconcileTournament(current, tick);
        if (
          reconciled.runtime.currentLevelIndex !==
          current.runtime.currentLevelIndex
        ) {
          saveTournament(reconciled);
          window.setTimeout(() => playAlert("level"), 0);
        }
        return reconciled;
      });
    }, 250);
    return () => window.clearInterval(interval);
  }, [playAlert]);

  const remainingMs = tournament ? getRemainingMs(tournament, now) : 0;

  useEffect(() => {
    if (
      !tournament ||
      !settings.soundEnabled ||
      settings.warningSeconds <= 0 ||
      (tournament.runtime.status !== "running" &&
        tournament.runtime.status !== "break")
    ) {
      return;
    }
    const threshold = settings.warningSeconds * 1000;
    if (
      remainingMs <= threshold &&
      warnedRevision.current !== tournament.runtime.revision
    ) {
      warnedRevision.current = tournament.runtime.revision;
      playAlert("warning");
    }
  }, [playAlert, remainingMs, settings, tournament]);

  const create = useCallback((name: string, startingStack: number) => {
    const created = createTournament({
      id: crypto.randomUUID(),
      name,
      startingStack,
      structure: fridayFeltStructure,
      now: Date.now(),
    });
    saveTournament(created);
    setTournament(created);
  }, []);

  const command = useCallback(
    (nextCommand: TournamentCommand) => {
      setTournament((current) => {
        if (!current) return current;
        const result = transitionTournament(current, nextCommand, Date.now());
        if (result.changed) {
          saveTournament(result.state);
          if (
            result.state.runtime.currentLevelIndex !==
            current.runtime.currentLevelIndex
          ) {
            window.setTimeout(() => playAlert("level"), 0);
          }
        }
        return result.state;
      });
    },
    [playAlert],
  );

  const clear = useCallback(() => {
    deleteTournament();
    setTournament(null);
  }, []);

  const updateSettings = useCallback((nextSettings: TimerSettings) => {
    saveSettings(nextSettings);
    setSettings(nextSettings);
  }, []);

  const value = useMemo(
    () => ({
      tournament,
      now,
      remainingMs,
      settings,
      create,
      command,
      clear,
      updateSettings,
      playAlert,
    }),
    [
      tournament,
      now,
      remainingMs,
      settings,
      create,
      command,
      clear,
      updateSettings,
      playAlert,
    ],
  );

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used inside TournamentProvider.");
  }
  return context;
}
