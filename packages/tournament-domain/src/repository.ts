import type { Tournament } from "./types";

export interface TournamentRepository {
  get(id: string): Promise<Tournament | null>;
  list(): Promise<Tournament[]>;
  save(tournament: Tournament): Promise<void>;
  delete(id: string): Promise<void>;
}
