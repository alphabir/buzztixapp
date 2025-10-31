const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

// Test the exact same configuration as the frontend
const trpcClient = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function testFrontendTRPC() {
  try {
    console.log('=== Testing Frontend TRPC Integration ===');
    
    // Test events route
    console.log('\n1. Testing events route...');
    const events = await trpcClient.events.getAll.query();
    console.log('Events loaded:', events.length);
    
    // Test a specific event
    if (events.length > 0) {
      console.log('\n2. Testing specific event...');
      const event = await trpcClient.events.getById.query({ id: events[0].id });
      console.log('Event loaded:', event.title);
    }
    
    console.log('\n=== Frontend TRPC Test Complete ===');
    
  } catch (error) {
    console.error('TRPC Test Error:', error.message);
  }
}

testFrontendTRPC();