export function parseMessage(message: string): Record<string, unknown> {
  try {
    if (!message) {
      throw new Error('Message cannot be empty in parseMessage');
    }
    
    const parsed = JSON.parse(message);
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateMessageContent(content: Record<string, unknown>): boolean {
  if (!content.action) {
    throw new Error('Message must contain an action field in validateMessageContent');
  }
  
  if (typeof content.action !== 'string') {
    throw new Error('Action must be a string in validateMessageContent');
  }
  
  return true;
}
