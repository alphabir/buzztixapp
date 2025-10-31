const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/api/trpc',
      transformer: superjson,
    }),
  ],
});

async function testTRPCConnection() {
  try {
    console.log('Testing TRPC connection...');
    
    // Test getting all events
    console.log('Calling events.getAll...');
    const events = await client.events.getAll.query();
    console.log('Events loaded successfully:', events.length, 'events');
    
    if (events.length > 0) {
      console.log('First event:', events[0].title);
    }
    
    console.log('TRPC connection test completed successfully!');
  } catch (error) {
    console.error('TRPC Connection Error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testTRPCConnection();