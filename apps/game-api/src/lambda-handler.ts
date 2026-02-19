import { createApiGatewayWsHandler } from '@boardgameio/server';
import { TicTacToeGame } from './tic-tac-toe';

/**
 * Export the configured handler for AWS Lambda
 */
export const handler = createApiGatewayWsHandler({
  games: [TicTacToeGame],
  // Optional: Configure database backend
  // db: new DynamoDBStorageAPI(),
  // Optional: Configure custom authentication
  // authenticateCredentials: (credentials) => { ... },
  // generateCredentials: (playerID) => { ... },
});
