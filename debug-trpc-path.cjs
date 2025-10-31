const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugTRPCPath() {
  try {
    console.log('Testing TRPC path...');
    
    // Try calling the TRPC endpoint with the correct path format
    const response = await fetch('http://localhost:8081/trpc/events.getAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'query',
        params: {}
      })
    });
    
    console.log('TRPC path call status:', response.status);
    console.log('TRPC path call headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('TRPC path response text:', text.substring(0, 200));
    
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

debugTRPCPath();