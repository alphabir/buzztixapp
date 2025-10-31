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
    console.log('=== Testing Complete Checkout Flow ===');
    
    // Test 1: Get events
    console.log('\n1. Getting events...');
    const events = await client.events.getAll.query();
    console.log('Events loaded:', events.length);
    
    // Test 2: Create user with unique email
    const uniqueEmail = `test-${Date.now()}@example.com`;
    console.log(`\n2. Creating user with email: ${uniqueEmail}`);
    const user = await client.users.create.mutate({
      name: "Test User",
      email: uniqueEmail,
      phone: "1234567890"
    });
    console.log('User created:', user.id);
    
    // Test 3: Create booking
    console.log('\n3. Creating booking...');
    const booking = await client.bookings.create.mutate({
      eventId: events[0].id,
      userId: user.id,
      totalAmount: 1500,
      tickets: [
        {
          type: "General Admission",
          quantity: 2,
          price: 750
        }
      ]
    });
    console.log('Booking created:', booking.id);
    
    // Test 4: Retrieve booking
    console.log('\n4. Retrieving booking...');
    const retrievedBooking = await client.bookings.getById.query({ id: booking.id });
    console.log('Booking retrieved successfully');
    console.log('Has QR code:', !!retrievedBooking.qrCode);
    console.log('Booking ID:', retrievedBooking.id);
    
    console.log('\n=== Checkout Flow Test Complete ===');
    console.log('All steps completed successfully!');
    
  } catch (error) {
    console.error('Error in checkout flow:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testCheckoutFlow();