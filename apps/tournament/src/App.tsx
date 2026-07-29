import type { CSSProperties, ReactNode } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";

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

const navigation: Array<{
  to: string;
  label: string;
  icon: IconName;
}> = [
  { to: "/control", label: "Tournament", icon: "spade" },
  { to: "/display", label: "Display Mode", icon: "calendar-day" },
  { to: "/structures", label: "Blind Structures", icon: "two-cards" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <a className="app-brand" href="/" aria-label="Friday Felt homepage">
          <img
            src={assetUrl("images/friday-felt-logo.png")}
            alt="Friday Felt"
          />
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
          <span className="status-dot" />
          <div>
            <strong>Local foundation</strong>
            <span>No tournament running</span>
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

function FoundationCard({
  eyebrow,
  title,
  description,
  status,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <article className="foundation-card">
      <span className="foundation-card__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="foundation-card__status">{status}</span>
    </article>
  );
}

function ConsolePage() {
  return (
    <section className="app-page">
      <header className="app-page__header">
        <div>
          <span className="app-page__eyebrow">Friday Felt Phase 3</span>
          <h1>Tournament Console</h1>
          <p>
            The application foundation is ready. Timer controls and live
            tournament state will be added here next.
          </p>
        </div>
        <span className="foundation-badge">Foundation release</span>
      </header>

      <div className="foundation-grid">
        <FoundationCard
          eyebrow="Core"
          title="Tournament engine"
          description="A tested, framework-independent state model for reliable tournament transitions."
          status="Domain ready"
        />
        <FoundationCard
          eyebrow="Structure"
          title="Blind levels"
          description="Play and break levels share a versioned structure that can grow into custom presets."
          status="Model ready"
        />
        <FoundationCard
          eyebrow="Reliability"
          title="Recovery layer"
          description="Persistence is isolated behind a repository contract for IndexedDB and future cloud sync."
          status="Contract ready"
        />
      </div>

      <section className="next-build">
        <span>Next build</span>
        <h2>Reliable timer controls and live countdown</h2>
        <p>
          Start, pause, resume, level navigation and refresh recovery will be
          implemented against the new tournament engine.
        </p>
      </section>
    </section>
  );
}

function PlaceholderPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="app-page">
      <header className="app-page__header">
        <div>
          <span className="app-page__eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <span className="foundation-badge">Coming next</span>
      </header>
      <section className="placeholder-panel">
        <Icon name="open-book" />
        <h2>Application route established</h2>
        <p>
          This screen is part of the shared tournament application and is ready
          for its Phase 1 functionality.
        </p>
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
        <Route
          path="/display"
          element={
            <PlaceholderPage
              eyebrow="Player view"
              title="Display Mode"
              description="A dedicated, read-only television and fullscreen tournament display."
            />
          }
        />
        <Route
          path="/structures"
          element={
            <PlaceholderPage
              eyebrow="Tournament setup"
              title="Blind Structures"
              description="Create, duplicate and organise play levels and scheduled breaks."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              eyebrow="Preferences"
              title="Settings"
              description="Tournament defaults, sounds, display behaviour and local data controls."
            />
          }
        />
        <Route path="*" element={<Navigate to="/control" replace />} />
      </Routes>
    </AppShell>
  );
}
