const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugTRPCRequest() {
  try {
    console.log('Testing TRPC request format...');
    
    // Test a proper TRPC request (POST with JSON body)
    const response = await fetch('http://localhost:8081/api/trpc/events.getAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        method: 'events.getAll',
        params: {}
      })
    });
    
    console.log('TRPC POST Response status:', response.status);
    console.log('TRPC POST Response headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('TRPC POST Response text length:', text.length);
    console.log('First 200 characters of response:');
    console.log(text.substring(0, 200));
    
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

debugTRPCRequest();