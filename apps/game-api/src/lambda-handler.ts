import type { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import { createGameHandler } from '@repo/boardgame.io/aws';
import { GameConfig } from './game';

/**
 * Export the configured handler for AWS Lambda
 */
export const handler: APIGatewayProxyWebsocketHandlerV2 = createGameHandler({
  games: [GameConfig],
  // Optional: Configure database backend
  // db: new DynamoDBStorageAPI(),
  // Optional: Configure custom authentication
  // authenticateCredentials: (credentials) => { ... },
  // generateCredentials: (playerID) => { ... },
});

