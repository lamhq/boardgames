import { parseMessage, validateMessageContent } from './utils';

export class MessageHandler {
  processMessage(data: string): Record<string, unknown> {
    const message = parseMessage(data);
    validateMessageContent(message);
    
    return {
      status: 'processed',
      action: message.action,
      timestamp: new Date().toISOString(),
    };
  }

  handleGameAction(actionData: Record<string, unknown>): void {
    if (!actionData.gameId) {
      throw new Error('gameId is required in handleGameAction');
    }

    if (!actionData.playerId) {
      throw new Error('playerId is required in handleGameAction');
    }

    console.log(`Processing game action for game ${actionData.gameId} by player ${actionData.playerId}`);
  }
}
