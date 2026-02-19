import { Transport } from './transport';
import type { TransportOpts } from './transport';
import type { Operation } from 'rfc6902';
import type {
  CredentialedActionShape,
  FilteredMetadata,
  LogEntry,
  PlayerID,
  State,
  SyncInfo,
  ChatMessage,
} from '../../../core/types';

interface WebSocketOpts {
  server?: string;
}

type WebSocketTransportOpts = TransportOpts & WebSocketOpts;

/**
 * Transport class that interacts with the Master via native WebSocket API.
 */
export class WebSocketTransport extends Transport {
  private server: string;

  public socket: WebSocket | null;

  /**
   * Creates a new WebSocket Transport instance.
   * @param {WebSocketTransportOpts} options - Configuration options
   * @param {string} options.server - The WebSocket server URL (e.g., 'wss://example.com').
   * @param {string} options.matchID - The game ID to connect to.
   * @param {string} options.playerID - The player ID associated with this client.
   * @param {string} options.credentials - Authentication credentials
   * @param {string} options.gameName - The game type (the `name` field in `Game`).
   * @param {number} options.numPlayers - The number of players.
   */
  public constructor({ server, ...opts }: WebSocketTransportOpts) {
    super(opts);
    this.server = server || '';
    this.socket = null;
  }

  private sendMessage(event: string, ...args: any[]): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, args });
      this.socket.send(message);
    } else {
      console.error('WebSocket is not connected. Unable to send message:', event, args);
    }
  }

  public connect(): void {
    if (this.socket) {
      return;
    }

    try {
      this.socket = new WebSocket(this.server);

      const handlePatchMessage = (
        matchID: string,
        prevStateID: number,
        stateID: number,
        patch: Operation[],
        deltalog: LogEntry[]
      ) => {
        this.notifyClient({
          type: 'patch',
          args: [matchID, prevStateID, stateID, patch, deltalog],
        });
      };

      const handleUpdateMessage = (
        matchID: string,
        state: State,
        deltalog: LogEntry[]
      ) => {
        this.notifyClient({
          type: 'update',
          args: [matchID, state, deltalog],
        });
      };

      const handleSyncMessage = (matchID: string, syncInfo: SyncInfo) => {
        this.notifyClient({
          type: 'sync',
          args: [matchID, syncInfo],
        });
      };

      const handleMatchDataMessage = (
        matchID: string,
        matchData: FilteredMetadata
      ) => {
        this.notifyClient({
          type: 'matchData',
          args: [matchID, matchData],
        });
      };

      const handleChatMessage = (matchID: string, chatMessage: ChatMessage) => {
        this.notifyClient({
          type: 'chat',
          args: [matchID, chatMessage],
        });
      };

      this.socket.onopen = () => {
        this.requestSync();
        this.setConnectionStatus(true);
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          const { event: eventType, args } = message;

          switch (eventType) {
            case 'patch': {
              const [matchID, prevStateID, stateID, patch, deltalog] = args;
              handlePatchMessage(matchID, prevStateID, stateID, patch, deltalog);
              break;
            }
            case 'update': {
              const [matchID, state, deltalog] = args;
              handleUpdateMessage(matchID, state, deltalog);
              break;
            }
            case 'sync': {
              const [matchID, syncInfo] = args;
              handleSyncMessage(matchID, syncInfo);
              break;
            }
            case 'matchData': {
              const [matchID, matchData] = args;
              handleMatchDataMessage(matchID, matchData);
              break;
            }
            case 'chat': {
              const [matchID, chatMessage] = args;
              handleChatMessage(matchID, chatMessage);
              break;
            }
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        this.setConnectionStatus(false);
      };

      this.socket.onclose = () => {
        this.setConnectionStatus(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.setConnectionStatus(false);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.setConnectionStatus(false);
  }

  public sendAction(state: State, action: CredentialedActionShape.Any): void {
    this.sendMessage('update', action, state._stateID, this.matchID, this.playerID);
  }

  public sendChatMessage(matchID: string, chatMessage: ChatMessage): void {
    this.sendMessage('chat', matchID, chatMessage, this.credentials);
  }

  public requestSync(): void {
    this.sendMessage('sync', this.matchID, this.playerID, this.credentials, this.numPlayers);
  }

  public updateMatchID(id: string): void {
    this.matchID = id;
    this.requestSync();
  }

  public updatePlayerID(id: PlayerID): void {
    this.playerID = id;
    this.requestSync();
  }

  public updateCredentials(credentials?: string): void {
    this.credentials = credentials;
    this.requestSync();
  }
}

export function NativeWebSocket(opts: WebSocketOpts = {}) {
  return (transportOpts: WebSocketTransportOpts) =>
    new WebSocketTransport({
      ...opts,
      ...transportOpts,
    });
}
