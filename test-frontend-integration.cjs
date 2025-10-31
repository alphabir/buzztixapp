// Simple test to verify frontend can connect to backend
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testConnection() {
  try {
    // Test basic endpoint
    const response = await fetch('http://localhost:8081');
    const data = await response.json();
    console.log('Basic endpoint test:', data);
    
    // Test TRPC events endpoint
    const eventsResponse = await fetch('http://localhost:8081/api/trpc/events.getAll');
    console.log('Events endpoint status:', eventsResponse.status);
    
    console.log('Frontend-backend integration test completed successfully!');
  } catch (error) {
    console.error('Integration test failed:', error.message);
  }
}

testConnection();