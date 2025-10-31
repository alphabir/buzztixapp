const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
    console.log('Testing TRPC events.getAll endpoint...');
    const events = await client.events.getAll.query();
    console.log('Events count:', events.length);
    
    if (events.length > 0) {
      console.log('First event:', events[0].title);
    }
    
    console.log('TRPC integration test completed successfully!');
  } catch (error) {
    console.error('Error calling TRPC endpoint:', error.message);
  }
}

testTRPC();