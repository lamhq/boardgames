import type { APIGatewayProxyWebsocketHandlerV2 } from "aws-lambda";
import type { Game, StorageAPI, Server } from "@boardgameio/core/types";
import { Master } from "@boardgameio/core/master";
import { Auth } from "@boardgameio/core/auth";
import { DBFromEnv } from "./db";
import { ProcessGameConfig } from "@boardgameio/core";
import type { TransportAPI } from "@boardgameio/core/master/master";
import { nanoid } from "nanoid";

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

/**
 * In-memory store for active connections.
 * In production, this should be persisted to DynamoDB or similar.
 */
const connections = new Map<string, ClientConnection>();

/**
 * Creates an API Gateway Websocket handler for boardgame.io
 *
 * This adapter enables boardgame.io games to run on AWS Lambda with API Gateway WebSocket.
 * It translates WebSocket events into boardgame.io protocol messages and manages game state.
 *
 * Usage example:
 * ```typescript
 * const handler = createApiGatewayWsHandler({
 *   games: [MyGame],
 *   db: new InMemory(),
 * });
 * ```
 *
 * @param config - Configuration object containing:
 *   - games: Array of game definitions
 *   - db: Storage backend (optional, defaults to in-memory)
 *   - uuid: UUID generator function (optional)
 *   - authenticateCredentials: Custom credential authentication (optional)
 *   - generateCredentials: Custom credential generator (optional)
 * @returns AWS Lambda WebSocket handler
 */
export function createApiGatewayWsHandler({
  games: rawGames,
  db: rawDb,
  uuid: uuidFn = () => nanoid(11),
  authenticateCredentials,
  generateCredentials,
}: GameHandlerConfig): APIGatewayProxyWebsocketHandlerV2 {
  // Process and validate game configs
  const games = (rawGames as any[]).map((game) => ProcessGameConfig(game));

  // Initialize database
  let db: any = rawDb;
  if (db === undefined) {
    db = DBFromEnv();
  }

  // Initialize authentication
  const auth = new Auth({ authenticateCredentials, generateCredentials });

  return async (event) => {
    const { routeKey, connectionId } = event.requestContext ?? {};
    const rawBody = event.body;

    if (!connectionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing connectionId" }),
      };
    }

    try {
      switch (routeKey) {
        case "$connect":
          return await handleConnect(connectionId);

        case "$default":
          if (!rawBody) {
            return {
              statusCode: 400,
              body: JSON.stringify({ error: "Missing request body" }),
            };
          }
          const message = JSON.parse(rawBody);
          return await handleMessage(
            connectionId,
            message,
            db,
            auth,
            games,
            uuidFn,
          );

        case "$disconnect":
          return await handleDisconnect(connectionId, db, auth, games);

        default:
          return {
            statusCode: 400,
            body: JSON.stringify({ error: `Unknown route: ${routeKey}` }),
          };
      }
    } catch (error) {
      console.error("Game handler error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error instanceof Error ? error.message : "Internal error",
        }),
      };
    }
  };
}

/**
 * Handle WebSocket $connect event
 */
async function handleConnect(
  connectionId: string,
): Promise<{ statusCode: number; body: string }> {
  // Initialize connection with empty data
  connections.set(connectionId, {
    matchID: "",
    playerID: undefined,
    credentials: undefined,
  });

  console.log(`Connection established: ${connectionId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Connected" }),
  };
}

/**
 * Handle incoming game messages from connected clients
 */
async function handleMessage(
  connectionId: string,
  message: any,
  db: any,
  auth: any,
  games: any[],
  _uuid: () => string,
): Promise<{ statusCode: number; body: string }> {
  const connection = connections.get(connectionId);
  if (!connection) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Connection not found" }),
    };
  }

  const {
    type,
    matchID,
    playerID,
    credentials,
    gameName,
    action,
    stateID,
    numPlayers,
    chatMessage,
  } = message;

  // Update connection info with new values
  if (matchID) connection.matchID = matchID;
  if (playerID !== undefined) connection.playerID = playerID;
  if (credentials) connection.credentials = credentials;

  // Find the requested game
  const game = games.find((g: any) => g.name === gameName);
  if (!game) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: `Game '${gameName}' not found` }),
    };
  }

  // Create transport API that collects responses for this client
  const responses: any[] = [];
  const transportAPI: TransportAPI = {
    send: ({ playerID: targetPlayerID, ...data }: any) => {
      // Only send to the current player if specified
      if (targetPlayerID === playerID) {
        responses.push(data);
      }
    },
    sendAll: (payload: any) => {
      // In Lambda context, we collect all broadcasts
      // In a real system, these would be sent to all connected clients via API Gateway
      responses.push(payload);
    },
  };

  // Create Master instance to handle game logic
  const master = new Master(
    game as any,
    db as StorageAPI.Async | StorageAPI.Sync,
    transportAPI,
    auth,
  );

  // Process the message based on type
  switch (type) {
    case "sync": {
      // Client requests game state synchronization
      // numPlayers is used to create game on-demand if it doesn't exist
      await master.onSync(matchID, playerID, credentials, numPlayers ?? 2);
      break;
    }

    case "update": {
      // Client makes a game action/move
      if (!action) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing action for update message" }),
        };
      }
      if (stateID === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Missing stateID for update message",
          }),
        };
      }
      await master.onUpdate(action, stateID, matchID, playerID);
      break;
    }

    case "chat": {
      // Client sends a chat message
      if (!chatMessage) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "Missing chatMessage for chat message",
          }),
        };
      }
      await master.onChatMessage(matchID, chatMessage, credentials);
      break;
    }

    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Unknown message type: ${type}` }),
      };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      responses,
      connectionId,
    }),
  };
}

/**
 * Handle WebSocket $disconnect event
 * Notifies the game server that a player has disconnected
 */
async function handleDisconnect(
  connectionId: string,
  db: any,
  auth: any,
  games: any[],
): Promise<{ statusCode: number; body: string }> {
  const connection = connections.get(connectionId);

  if (connection && connection.matchID && connection.playerID) {
    // Notify the game that the player disconnected
    const game = games.find((g: any) => g.name === connection.matchID);
    if (game) {
      // Create transport API for disconnect notification
      const transportAPI: TransportAPI = {
        send: () => {
          // No need to send individual responses during disconnect
        },
        sendAll: (payload: any) => {
          // Broadcast disconnect to other players
          console.log("Disconnect broadcast:", payload);
        },
      };

      const master = new Master(
        game as any,
        db as StorageAPI.Async | StorageAPI.Sync,
        transportAPI,
        auth,
      );

      // Notify master that this player is disconnecting
      await master.onConnectionChange(
        connection.matchID,
        connection.playerID,
        connection.credentials,
        false,
      );
    }
  }

  // Clean up connection
  connections.delete(connectionId);
  console.log(`Connection closed: ${connectionId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Disconnected" }),
  };
}
