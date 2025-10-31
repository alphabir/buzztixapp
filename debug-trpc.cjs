const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugTRPC() {
  try {
    console.log('Testing raw TRPC endpoint...');
    const response = await fetch('http://localhost:8081/api/trpc/events.getAll');
    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('Response text:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON:', json);
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugTRPC();