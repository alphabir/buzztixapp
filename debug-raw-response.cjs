const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugRawResponse() {
  try {
    console.log('Testing raw TRPC response...');
    
    // Test getting all events with raw fetch
    const response = await fetch('http://localhost:8081/api/trpc/events.getAll');
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('Raw response text length:', text.length);
    console.log('First 200 characters of response:');
    console.log(text.substring(0, 200));
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      console.log('Successfully parsed JSON');
      console.log('JSON keys:', Object.keys(json));
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError.message);
      console.log('Character at position 4:', text.charAt(4));
      console.log('Character codes around position 4:', 
        text.charCodeAt(0), text.charCodeAt(1), text.charCodeAt(2), text.charCodeAt(3), text.charCodeAt(4));
    }
    
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

debugRawResponse();