import type Koa from 'koa';
import type { CorsOptions } from 'cors';
import type { SocketIO } from './transport/socketio';
import type { Auth } from '@bgio/core/auth';
import type { Server as ServerTypes, Game, StorageAPI } from '@bgio/core/types';

export type ServerAppCtx = Koa.DefaultContext & {
  db: StorageAPI.Async | StorageAPI.Sync;
  auth: Auth;
};

export type ServerApp = Koa<Koa.DefaultState, ServerAppCtx>;

export type KoaServer = ReturnType<import('koa')['default']['prototype']['listen']>;

export interface ServerConfig {
  port?: number;
  callback?: () => void;
  lobbyConfig?: {
    apiPort: number;
    apiCallback?: () => void;
  };
}

export interface HttpsOptions {
  cert: string;
  key: string;
}

export interface ServerOpts {
  games: Game[];
  origins?: CorsOptions['origin'];
  apiOrigins?: CorsOptions['origin'];
  db?: StorageAPI.Async | StorageAPI.Sync;
  transport?: SocketIO;
  uuid?: () => string;
  authenticateCredentials?: ServerTypes.AuthenticateCredentials;
  generateCredentials?: ServerTypes.GenerateCredentials;
  https?: HttpsOptions;
}
