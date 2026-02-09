import type { APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event) => {
  const { routeKey, connectionId } = event.requestContext ?? {};
  console.log('connectionId:', connectionId);
  
  try {
    switch (routeKey) {
      case '$connect':
        return { statusCode: 200, body: 'Connected' };
      case '$disconnect':
        return { statusCode: 200, body: 'Disconnected' };
      case '$default':
        return { statusCode: 200, body: 'Message received' };
      default:
        return { statusCode: 400, body: 'Unknown route' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Internal error' };
  }
};
