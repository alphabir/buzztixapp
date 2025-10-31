const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/api/trpc',
      fetch: fetch,
      transformer: superjson,
    }),
  ],
});

async function testTRPCFrontend() {
  try {
    console.log('Testing TRPC frontend integration...');
    
    // Test getting all events
    console.log('Calling events.getAll...');
    const events = await client.events.getAll.query();
    console.log('Events loaded successfully:', events.length, 'events');
    
    if (events.length > 0) {
      console.log('First event:', events[0].title);
    }
    
    console.log('TRPC frontend test completed successfully!');
  } catch (error) {
    console.error('TRPC Frontend Error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testTRPCFrontend();