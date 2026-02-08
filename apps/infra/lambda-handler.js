exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  
  const routeKey = event.requestContext?.routeKey;
  const connectionId = event.requestContext?.connectionId;
  
  try {
    switch (routeKey) {
      case '$connect':
        console.log(`Client connected: ${connectionId}`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Connected' })
        };
        
      case '$disconnect':
        console.log(`Client disconnected: ${connectionId}`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Disconnected' })
        };
        
      case '$default':
        console.log(`Message from ${connectionId}: ${event.body}`);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Message received' })
        };
        
      default:
        console.log(`Unknown route: ${routeKey}`);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Unknown route' })
        };
    }
  } catch (error) {
    console.error('Error handling event:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
