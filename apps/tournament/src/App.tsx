import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  getCurrentLevel,
  type BlindLevel,
  type TournamentCommand,
} from "@friday-felt/tournament-domain";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { fridayFeltStructure } from "./presets";
import { useTournament } from "./tournament-context";

type IconName =
  | "spade"
  | "calendar-day"
  | "settings"
  | "open-book"
  | "two-cards";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function Icon({ name }: { name: IconName }) {
  return (
    <span
      className="ff-app-icon"
      style={
        {
          "--ff-app-icon": `url("${assetUrl(`icons/${name}.svg`)}")`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

const navigation: Array<{ to: string; label: string; icon: IconName }> = [
  { to: "/control", label: "Tournament", icon: "spade" },
  { to: "/display", label: "Display Mode", icon: "calendar-day" },
  { to: "/structures", label: "Blind Structure", icon: "two-cards" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

function formatClock(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function levelName(level: BlindLevel): string {
  return level.kind === "break"
    ? level.label ?? "Break"
    : `${level.smallBlind.toLocaleString()} / ${level.bigBlind.toLocaleString()}`;
}

function AppShell({ children }: { children: ReactNode }) {
  const { tournament } = useTournament();
  const active =
    tournament?.runtime.status === "running" ||
    tournament?.runtime.status === "break";

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a className="app-brand" href="/" aria-label="Friday Felt homepage">
          <img src={assetUrl("images/friday-felt-logo.png")} alt="Friday Felt" />
        </a>

        <nav className="app-navigation" aria-label="Tournament application">
          <p className="app-navigation__label">Tournament console</p>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `app-navigation__item${isActive ? " is-active" : ""}`
              }
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar__status">
          <span className={`status-dot${active ? " is-live" : ""}`} />
          <div>
            <strong>{active ? "Tournament live" : "Tournament console"}</strong>
            <span>
              {tournament ? tournament.name : "No tournament configured"}
            </span>
          </div>
        </div>

        <a className="app-sidebar__return" href="/">
          ← Return to Friday Felt
        </a>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <header className="app-page__header">
      <div>
        <span className="app-page__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {badge && <span className="foundation-badge">{badge}</span>}
    </header>
  );
}

function TournamentSetup() {
  const { create } = useTournament();
  const [name, setName] = useState("Friday Night Poker Tour · Event 1");
  const [startingStack, setStartingStack] = useState(2100);

  function submit(event: FormEvent) {
    event.preventDefault();
    create(name.trim() || "Friday Felt Tournament", startingStack);
  }

  return (
    <section className="setup-panel">
      <div className="setup-panel__intro">
        <span className="app-page__eyebrow">New tournament</span>
        <h2>Ready when the table is.</h2>
        <p>
          Start with the official Friday Night Poker Tour structure. You can
          review every blind and break before the clock begins.
        </p>
      </div>
      <form className="setup-form" onSubmit={submit}>
        <label>
          Tournament name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
          />
        </label>
        <label>
          Starting stack
          <input
            type="number"
            min="100"
            step="100"
            value={startingStack}
            onChange={(event) => setStartingStack(Number(event.target.value))}
          />
        </label>
        <div className="structure-summary">
          <span>{fridayFeltStructure.name}</span>
          <strong>8 levels · 1 break · 2 hours 5 minutes</strong>
        </div>
        <button className="button button--primary" type="submit">
          Create tournament <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}

function TimerControls({
  command,
  status,
}: {
  command: (command: TournamentCommand) => void;
  status: string;
}) {
  const isIdle = status === "idle";
  const isPaused = status === "paused";
  const isActive = status === "running" || status === "break";

  return (
    <div className="timer-controls" aria-label="Tournament controls">
      <button
        className="control-button"
        onClick={() => command({ type: "PREVIOUS_LEVEL" })}
        title="Previous level"
      >
        <span aria-hidden="true">←</span>
        Previous
      </button>
      <button
        className="control-button control-button--primary"
        onClick={() =>
          command({
            type: isIdle ? "START" : isPaused ? "RESUME" : "PAUSE",
          })
        }
        disabled={!isIdle && !isPaused && !isActive}
      >
        <span aria-hidden="true">{isActive ? "Ⅱ" : "▶"}</span>
        {isIdle ? "Start clock" : isPaused ? "Resume" : "Pause"}
      </button>
      <button
        className="control-button"
        onClick={() => command({ type: "NEXT_LEVEL" })}
        title="Next level"
      >
        Next
        <span aria-hidden="true">→</span>
      </button>
      <button
        className="control-button control-button--quiet"
        onClick={() => command({ type: "ADD_TIME", milliseconds: 60_000 })}
      >
        + 1 minute
      </button>
    </div>
  );
}

function LiveTimer() {
  const { tournament, remainingMs, command, clear } = useTournament();
  const navigate = useNavigate();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        const status = tournament?.runtime.status;
        if (!status) return;
        command({
          type:
            status === "idle"
              ? "START"
              : status === "paused"
                ? "RESUME"
                : "PAUSE",
        });
      }
      if (event.key === "ArrowRight") command({ type: "NEXT_LEVEL" });
      if (event.key === "ArrowLeft") command({ type: "PREVIOUS_LEVEL" });
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [command, tournament]);

  if (!tournament) return <TournamentSetup />;

  const current = getCurrentLevel(tournament);
  const next =
    tournament.structure.levels[tournament.runtime.currentLevelIndex + 1];
  const status = tournament.runtime.status;

  function reset() {
    if (window.confirm("Reset this tournament to Level 1?")) {
      command({ type: "RESET" });
    }
  }

  function remove() {
    if (window.confirm("Delete this local tournament and start again?")) clear();
  }

  return (
    <>
      <section className={`timer-card timer-card--${current.kind}`}>
        <div className="timer-card__topline">
          <span className={`live-status live-status--${status}`}>
            {status === "running"
              ? "Clock running"
              : status === "break"
                ? "Break"
                : status}
          </span>
          <span>
            Level {tournament.runtime.currentLevelIndex + 1} of{" "}
            {tournament.structure.levels.length}
          </span>
        </div>
        <div className="timer-card__content">
          <p>{current.kind === "break" ? "Scheduled break" : "Current blinds"}</p>
          <h2>{levelName(current)}</h2>
          <div className="timer-clock" aria-live="off">
            {formatClock(remainingMs)}
          </div>
          <div className="next-level">
            <span>Up next</span>
            <strong>{next ? levelName(next) : "Tournament complete"}</strong>
          </div>
        </div>
        <TimerControls command={command} status={status} />
      </section>

      <div className="organiser-actions">
        <button
          className="button button--secondary"
          onClick={() => navigate("/display")}
        >
          Open display mode
        </button>
        <button className="text-button" onClick={reset}>
          Reset tournament
        </button>
        <button className="text-button text-button--danger" onClick={remove}>
          Delete
        </button>
      </div>
      <p className="keyboard-hint">
        Keyboard: Space to start or pause · Arrow keys to change level
      </p>
    </>
  );
}

function ConsolePage() {
  const { tournament } = useTournament();
  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Tournament control"
        title="Tournament Timer"
        description="A reliable clock for the organiser. Your tournament is saved locally and continues accurately after refresh or sleep."
        badge={tournament ? "Saved locally" : "Ready to configure"}
      />
      <LiveTimer />
    </section>
  );
}

function DisplayPage() {
  const { tournament, remainingMs, settings } = useTournament();
  const navigate = useNavigate();
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));
  const tournamentId = tournament?.id;

  useEffect(() => {
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  useEffect(() => {
    if (!settings.keepScreenAwake || !tournament) return;
    let lock: { release: () => Promise<void> } | undefined;
    const wakeLock = (
      navigator as Navigator & {
        wakeLock?: { request: () => Promise<{ release: () => Promise<void> }> };
      }
    ).wakeLock;
    void wakeLock
      ?.request()
      .then((value) => {
        lock = value;
      })
      .catch(() => {
        // Unsupported permission states should never interrupt the display.
      });
    return () => {
      void lock?.release();
    };
  }, [settings.keepScreenAwake, tournamentId]);

  if (!tournament) {
    return (
      <section className="app-page">
        <PageHeader
          eyebrow="Player view"
          title="Display Mode"
          description="Create a tournament before opening the table display."
        />
        <button className="button button--primary empty-action" onClick={() => navigate("/control")}>
          Configure tournament
        </button>
      </section>
    );
  }

  const current = getCurrentLevel(tournament);
  const next =
    tournament.structure.levels[tournament.runtime.currentLevelIndex + 1];

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }

  return (
    <section className={`display-stage display-stage--${current.kind}`}>
      <div className="display-stage__brand">
        <img src={assetUrl("images/friday-felt-logo.png")} alt="Friday Felt" />
        <span>{tournament.name}</span>
      </div>
      <div className="display-stage__status">
        {tournament.runtime.status === "paused"
          ? "Clock paused"
          : current.kind === "break"
            ? "Break"
            : `Level ${tournament.runtime.currentLevelIndex + 1}`}
      </div>
      <div className="display-stage__main">
        <p>{current.kind === "break" ? current.label : "Blinds"}</p>
        <h1>{levelName(current)}</h1>
        <div className="display-clock">{formatClock(remainingMs)}</div>
      </div>
      <div className="display-stage__next">
        <span>Next</span>
        <strong>{next ? levelName(next) : "Tournament complete"}</strong>
      </div>
      <div className="display-stage__actions">
        <button onClick={() => navigate("/control")}>Organiser controls</button>
        <button onClick={() => void toggleFullscreen()}>
          {fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        </button>
      </div>
    </section>
  );
}

function StructuresPage() {
  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Tournament setup"
        title="Blind Structure"
        description="The first official Friday Felt structure is designed for a relaxed four-to-nine-player family tournament."
        badge="Built-in preset"
      />
      <div className="structure-table" role="table" aria-label="Blind structure">
        <div className="structure-table__row structure-table__head" role="row">
          <span>Level</span>
          <span>Blinds</span>
          <span>Duration</span>
        </div>
        {fridayFeltStructure.levels.map((level, index) => (
          <div
            className={`structure-table__row${level.kind === "break" ? " is-break" : ""}`}
            role="row"
            key={level.id}
          >
            <span>{level.kind === "break" ? "Break" : index + 1}</span>
            <strong>{levelName(level)}</strong>
            <span>{Math.round(level.durationMs / 60_000)} minutes</span>
          </div>
        ))}
      </div>
      <p className="page-note">
        Custom structure editing will arrive after the live timer has been
        proven during real events.
      </p>
    </section>
  );
}

function SettingsPage() {
  const { settings, updateSettings, playAlert } = useTournament();
  return (
    <section className="app-page">
      <PageHeader
        eyebrow="Preferences"
        title="Timer Settings"
        description="These preferences are saved on this device and apply to organiser and display modes."
        badge="Device settings"
      />
      <section className="settings-panel">
        <label className="setting-row">
          <span>
            <strong>Audio alerts</strong>
            <small>Play a tone before and at the end of each level.</small>
          </span>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(event) =>
              updateSettings({ ...settings, soundEnabled: event.target.checked })
            }
          />
        </label>
        <label className="setting-row">
          <span>
            <strong>Warning time</strong>
            <small>Choose when the early warning tone plays.</small>
          </span>
          <select
            value={settings.warningSeconds}
            onChange={(event) =>
              updateSettings({
                ...settings,
                warningSeconds: Number(event.target.value),
              })
            }
          >
            <option value="0">Off</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
          </select>
        </label>
        <label className="setting-row">
          <span>
            <strong>Keep display awake</strong>
            <small>Prevent supported devices from sleeping during play.</small>
          </span>
          <input
            type="checkbox"
            checked={settings.keepScreenAwake}
            onChange={(event) =>
              updateSettings({
                ...settings,
                keepScreenAwake: event.target.checked,
              })
            }
          />
        </label>
        <button className="button button--secondary" onClick={() => playAlert("level")}>
          Test alert sound
        </button>
      </section>
    </section>
  );
}

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/control" replace />} />
        <Route path="/control" element={<ConsolePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/structures" element={<StructuresPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/control" replace />} />
      </Routes>
    </AppShell>
  );
}
