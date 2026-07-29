import type { Tournament } from "@friday-felt/tournament-domain";

const TOURNAMENT_KEY = "friday-felt.active-tournament.v1";
const SETTINGS_KEY = "friday-felt.timer-settings.v1";

export interface TimerSettings {
  soundEnabled: boolean;
  warningSeconds: number;
  keepScreenAwake: boolean;
}

export const defaultSettings: TimerSettings = {
  soundEnabled: true,
  warningSeconds: 60,
  keepScreenAwake: true,
};

export function loadTournament(): Tournament | null {
  try {
    const value = localStorage.getItem(TOURNAMENT_KEY);
    return value ? (JSON.parse(value) as Tournament) : null;
  } catch {
    return null;
  }
}

export function saveTournament(tournament: Tournament): void {
  localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(tournament));
}

export function deleteTournament(): void {
  localStorage.removeItem(TOURNAMENT_KEY);
}

export function loadSettings(): TimerSettings {
  try {
    const value = localStorage.getItem(SETTINGS_KEY);
    return value
      ? { ...defaultSettings, ...(JSON.parse(value) as Partial<TimerSettings>) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: TimerSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

