import type { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import { createGameHandler } from '@libs/boardgame.io/aws';
import { TicTacToeGame } from '@libs/games';

/**
 * Export the configured handler for AWS Lambda
 */
export const handler: APIGatewayProxyWebsocketHandlerV2 = createGameHandler({
  games: [TicTacToeGame],
  // Optional: Configure database backend
  // db: new DynamoDBStorageAPI(),
  // Optional: Configure custom authentication
  // authenticateCredentials: (credentials) => { ... },
  // generateCredentials: (playerID) => { ... },
});
