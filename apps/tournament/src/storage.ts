import type {
  BlindStructure,
  Tournament,
} from "@friday-felt/tournament-domain";

const TOURNAMENT_KEY = "friday-felt.active-tournament.v1";
const SETTINGS_KEY = "friday-felt.timer-settings.v1";
const CUSTOM_STRUCTURE_KEY = "friday-felt.custom-structure.v1";

export interface TimerSettings {
  soundEnabled: boolean;
  warningSeconds: number;
  keepScreenAwake: boolean;
  showChipGuide: boolean;
}

export const defaultSettings: TimerSettings = {
  soundEnabled: true,
  warningSeconds: 60,
  keepScreenAwake: true,
  showChipGuide: false,
};

export function loadTournament(): Tournament | null {
  try {
    const value = localStorage.getItem(TOURNAMENT_KEY);
    return value ? (JSON.parse(value) as Tournament) : null;
  } catch {
    return null;
  }
}

export function saveTournament(tournament: Tournament): boolean {
  try {
    localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(tournament));
    return true;
  } catch {
    return false;
  }
}

export function deleteTournament(): void {
  try {
    localStorage.removeItem(TOURNAMENT_KEY);
  } catch {
    // The in-memory tournament can still be cleared when storage is blocked.
  }
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
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Preferences still apply for the current session when storage is blocked.
  }
}

export function loadCustomStructure(): BlindStructure | null {
  try {
    const value = localStorage.getItem(CUSTOM_STRUCTURE_KEY);
    return value ? (JSON.parse(value) as BlindStructure) : null;
  } catch {
    return null;
  }
}

export function saveCustomStructure(structure: BlindStructure): boolean {
  try {
    localStorage.setItem(CUSTOM_STRUCTURE_KEY, JSON.stringify(structure));
    return true;
  } catch {
    return false;
  }
}
