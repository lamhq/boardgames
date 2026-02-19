/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import type { ProcessGameConfig } from '../../../core';
import type { TransportData } from '../../../core/master/master';
import type {
  Game,
  PlayerID,
  CredentialedActionShape,
  State,
  SyncInfo,
  ChatMessage,
} from '../../../core/types';

export type MetadataCallback = (metadata: SyncInfo['filteredMetadata']) => void;

export type ChatCallback = (message: ChatMessage) => void;

export interface TransportOpts {
  transportDataCallback: (data: TransportData) => void;
  gameName?: string;
  gameKey: Game;
  game: ReturnType<typeof ProcessGameConfig>;
  playerID?: PlayerID;
  matchID?: string;
  credentials?: string;
  numPlayers?: number;
}

/**
 * Transport
 *
 * Abstract base class for transport implementations that handle communication
 * between the client and the game server. Subclasses must implement the abstract
 * methods to provide specific transport mechanisms (e.g., WebSocket, HTTP polling).
 *
 * The Transport class manages:
 * - Connection state and lifecycle
 * - Game configuration (game name, player ID, match ID, credentials)
 * - Callbacks for receiving server data and connection status changes
 */
export abstract class Transport {
  /** The name of the game being played. */
  protected gameName: string;

  /** The ID of the player using this transport (null if not assigned). */
  protected playerID: PlayerID | null;

  /** The ID of the match/game session to connect to. */
  protected matchID: string;

  /** Optional authentication credentials for the player. */
  protected credentials?: string;

  /** The total number of players in the game. */
  protected numPlayers: number;

  /** Callback function invoked when the server sends data to the client. */
  private transportDataCallback: (data: TransportData) => void;

  /** Callback function invoked when the connection status changes (connected/disconnected). */
  private connectionStatusCallback: () => void = () => {};

  public isConnected = false;

  public constructor({
    transportDataCallback,
    gameName,
    playerID,
    matchID,
    credentials,
    numPlayers,
  }: TransportOpts) {
    this.transportDataCallback = transportDataCallback;
    this.gameName = gameName || 'default';
    this.playerID = playerID || null;
    this.matchID = matchID || 'default';
    this.credentials = credentials;
    this.numPlayers = numPlayers || 2;
  }

  /** Register a callback to be notified of connection status changes. */
  public subscribeToConnectionStatus(fn: () => void): void {
    this.connectionStatusCallback = fn;
  }

  /** Signal a connection status change and invoke the registered callback. */
  protected setConnectionStatus(isConnected: boolean): void {
    this.isConnected = isConnected;
    this.connectionStatusCallback();
  }

  /** Notify the client of data received from the server. */
  protected notifyClient(data: TransportData): void {
    this.transportDataCallback(data);
  }

  /** Establish a connection to the game server. */
  public abstract connect(): void;

  /** Close the connection to the game server. */
  public abstract disconnect(): void;

  /** Send a game action to the server. */
  public abstract sendAction(state: State, action: CredentialedActionShape.Any): void;

  /** Send a chat message to other players via the server. */
  public abstract sendChatMessage(matchID: string, chatMessage: ChatMessage): void;

  /** Request a full game state synchronization from the server. */
  public abstract requestSync(): void;

  /** Change the match ID and resync the game state. */
  public abstract updateMatchID(id: string): void;

  /** Change the player ID and resync the game state. */
  public abstract updatePlayerID(id: PlayerID): void;

  /** Update authentication credentials and resync the game state. */
  public abstract updateCredentials(credentials?: string): void;
}
