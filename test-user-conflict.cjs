const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function testUserConflict() {
  try {
    console.log('=== Testing User Conflict Handling ===');
    
    // Create a user with a specific email
    const testEmail = `conflict-test-${Date.now()}@example.com`;
    console.log(`\n1. Creating first user with email: ${testEmail}`);
    const user1 = await client.users.create.mutate({
      name: "Test User 1",
      email: testEmail,
      phone: "1234567890"
    });
    console.log('First user created:', user1.id);
    
    // Try to create another user with the same email (should fail)
    console.log(`\n2. Trying to create second user with same email: ${testEmail}`);
    try {
      const user2 = await client.users.create.mutate({
        name: "Test User 2",
        email: testEmail,
        phone: "0987654321"
      });
      console.log('Second user created (unexpected):', user2.id);
    } catch (error) {
      console.log('Expected error occurred:', error.message);
      console.log('Error code indicates unique constraint violation');
    }
    
    // Try to get the existing user
    console.log('\n3. Retrieving existing user by email...');
    const existingUser = await client.users.getByEmail.query({ email: testEmail });
    console.log('Existing user retrieved:', existingUser.id);
    
    console.log('\n=== User Conflict Test Complete ===');
    
  } catch (error) {
    console.error('Error in user conflict test:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testUserConflict();