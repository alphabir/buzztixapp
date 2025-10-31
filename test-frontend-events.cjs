const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFrontendEvents() {
  try {
    console.log('Testing if frontend can access events...');
    
    // Wait a bit for the app to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try to access the web app
    const response = await fetch('http://localhost:8082');
    console.log('Frontend web app status:', response.status);
    
    // Try to access the TRPC endpoint directly
    const trpcResponse = await fetch('http://localhost:8081/trpc/events.getAll');
    console.log('TRPC endpoint status:', trpcResponse.status);
    
    if (trpcResponse.ok) {
      const data = await trpcResponse.json();
      console.log('Events loaded successfully:', data.result.data.json.length, 'events found');
    }
    
    console.log('Frontend-backend integration test completed!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFrontendEvents();