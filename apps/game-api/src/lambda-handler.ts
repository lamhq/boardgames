import type { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import { MessageHandler } from './message-handler';

const messageHandler = new MessageHandler();

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
  const { routeKey, connectionId } = event.requestContext ?? {};
  const body = event.body || '';
  
  console.log('connectionId:', connectionId);
  console.log('routeKey:', routeKey);
  
  try {
    switch (routeKey) {
      case '$connect': {
        console.log('Client connecting with id:', connectionId);
        return { statusCode: 200, body: JSON.stringify({ message: 'Connected', connectionId }) };
      }
      
      case '$disconnect': {
        console.log('Client disconnecting with id:', connectionId);
        return { statusCode: 200, body: JSON.stringify({ message: 'Disconnected' }) };
      }
      
      case '$default': {
        // Test source maps: parse and process the message
        const result = messageHandler.processMessage(body);
        
        // This will throw if gameId or playerId is missing
        messageHandler.handleGameAction(result);
        
        return { statusCode: 200, body: JSON.stringify({ message: 'Message processed', action: result.action }) };
      }
      
      default:
        return { statusCode: 400, body: JSON.stringify({ message: 'Unknown route' }) };
    }
  } catch (error) {
    console.error('Error occurred:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: 'Internal error',
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      }) 
    };
  }
};
