import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "@friday-felt/design-system/tokens.css";
import "./styles.css";
import { App } from "./App";
import { TournamentProvider } from "./tournament-context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <TournamentProvider>
        <App />
      </TournamentProvider>
    </HashRouter>
  </StrictMode>,
);
