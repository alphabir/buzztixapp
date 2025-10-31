const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const fetch = require('node-fetch');

// Create a TRPC client
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/api/trpc',
      fetch: fetch,
    }),
  ],
});

async function testTRPC() {
  try {
    // Test getting all events
    const events = await client.events.getAll.query();
    console.log('Events count:', events.length);
    
    if (events.length > 0) {
      console.log('First event:', events[0].title);
    }
  } catch (error) {
    console.error('Error calling TRPC endpoint:', error);
  }
}

testTRPC();