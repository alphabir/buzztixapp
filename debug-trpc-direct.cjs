const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugTRPCDirect() {
  try {
    console.log('Testing direct TRPC call...');
    
    // Try calling the TRPC endpoint with the correct format
    // TRPC typically uses POST requests with a specific format
    const response = await fetch('http://localhost:8081/trpc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'events.getAll',
        params: {}
      })
    });
    
    console.log('Direct TRPC call status:', response.status);
    console.log('Direct TRPC call headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('Direct TRPC response text:', text);
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('Successfully parsed JSON');
      console.log('JSON keys:', Object.keys(json));
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

debugTRPCDirect();