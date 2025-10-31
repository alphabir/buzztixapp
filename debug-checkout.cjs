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

async function debugCheckout() {
  try {
    console.log('=== Debugging Checkout Process ===');
    
    // Test 1: Check if we can get events
    console.log('\n1. Testing events.getAll...');
    const events = await client.events.getAll.query();
    console.log('Events count:', events.length);
    
    // Test 2: Try to create a user with a unique email
    const uniqueEmail = `test-${Date.now()}@example.com`;
    console.log(`\n2. Creating user with email: ${uniqueEmail}`);
    const userResult = await client.users.create.mutate({
      name: "Test User",
      email: uniqueEmail,
      phone: "1234567890"
    });
    console.log('User created:', userResult.id);
    
    // Test 3: Create a booking
    console.log('\n3. Creating booking...');
    const bookingResult = await client.bookings.create.mutate({
      eventId: events[0].id, // Use first event
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
    
    // Test 4: Get booking by ID
    console.log('\n4. Retrieving booking...');
    const retrievedBooking = await client.bookings.getById.query({ id: bookingResult.id });
    console.log('Booking retrieved with QR code:', !!retrievedBooking.qrCode);
    
    console.log('\n=== Checkout Debug Complete ===');
  } catch (error) {
    console.error('Debug Error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

debugCheckout();