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

async function testCheckoutFlow() {
  try {
    console.log('Testing checkout flow...');
    
    // Test creating a user
    console.log('Creating user...');
    const userResult = await client.users.create.mutate({
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890"
    });
    console.log('User created:', userResult.id);
    
    // Test creating a booking
    console.log('Creating booking...');
    const bookingResult = await client.bookings.create.mutate({
      eventId: "ce9445e6-3543-4913-b9d2-121e0906f93f", // Use a valid event ID
      userId: userResult.id,
      totalAmount: 1000,
      tickets: [
        {
          type: "General Admission",
          quantity: 2,
          price: 500
        }
      ]
    });
    console.log('Booking created:', bookingResult.id);
    
    console.log('Checkout flow test completed successfully!');
  } catch (error) {
    console.error('Checkout Flow Error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testCheckoutFlow();