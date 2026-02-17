import type { Game, StorageAPI, Server } from "../types";

export interface ClientConnection {
  matchID: string;
  playerID: string | undefined;
  credentials: string | undefined;
}

export interface GameHandlerConfig {
  games: Game[];
  db?: StorageAPI.Async | StorageAPI.Sync;
  uuid?: () => string;
  authenticateCredentials?: Server.AuthenticateCredentials;
  generateCredentials?: Server.GenerateCredentials;
}
