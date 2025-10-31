const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugTRPCResponse() {
  try {
    console.log('Debugging TRPC response...');
    
    // Test the actual HTTP request that TRPC makes
    const response = await fetch('http://localhost:8081/api/trpc/events.getAll', {
      method: 'GET',
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('Response text:', JSON.stringify(text));
    console.log('Response text length:', text.length);
    console.log('First 10 characters:', text.substring(0, 10));
    console.log('Character codes:', [...text.substring(0, 10)].map(c => c.charCodeAt(0)));
    
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

debugTRPCResponse();