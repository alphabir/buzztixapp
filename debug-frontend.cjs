const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugFrontend() {
  try {
    console.log('=== Debugging Frontend Integration ===');
    
    // Test 1: Check if backend is accessible
    console.log('\n1. Testing backend connectivity...');
    const backendResponse = await fetch('http://localhost:8081');
    console.log('Backend status:', backendResponse.status);
    const backendData = await backendResponse.json();
    console.log('Backend response:', backendData);
    
    // Test 2: Check TRPC endpoint
    console.log('\n2. Testing TRPC endpoint...');
    const trpcResponse = await fetch('http://localhost:8081/trpc/events.getAll');
    console.log('TRPC status:', trpcResponse.status);
    const trpcData = await trpcResponse.json();
    console.log('TRPC response keys:', Object.keys(trpcData));
    
    if (trpcData.result && trpcData.result.data) {
      console.log('Events count:', trpcData.result.data.json.length);
      console.log('First event title:', trpcData.result.data.json[0].title);
    }
    
    // Test 3: Check frontend
    console.log('\n3. Testing frontend connectivity...');
    const frontendResponse = await fetch('http://localhost:8082');
    console.log('Frontend status:', frontendResponse.status);
    
    console.log('\n=== Debug Complete ===');
  } catch (error) {
    console.error('Debug error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugFrontend();