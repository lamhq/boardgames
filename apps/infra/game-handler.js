/**
 * WebSocket Lambda Handler - Sample Starter Code
 * 
 * This is a minimal starter template for handling WebSocket events from API Gateway.
 * It demonstrates the basic structure and event handling patterns.
 * 
 * ⚠️ IMPORTANT: This file contains NO BUSINESS LOGIC
 * 
 * Before deploying to production:
 * 1. Replace this with your actual game/application logic
 * 2. Implement proper message routing and processing
 * 3. Add database connectivity (DynamoDB, RDS, etc.)
 * 4. Implement connection management (store, retrieve, clean up connections)
 * 5. Add proper error handling and validation
 * 6. Update IAM permissions to match actual service requirements
 * 
 * This template only handles event structure and basic routing.
 */

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
