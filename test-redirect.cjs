const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

// Test the exact same configuration as the frontend
const trpcClient = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function testRedirectFlow() {
  try {
    console.log('=== Testing Redirect Flow ===');
    
    // Test 1: Get events
    console.log('\n1. Getting events...');
    const events = await trpcClient.events.getAll.query();
    console.log('Events loaded:', events.length);
    
    // Test 2: Create user
    const testEmail = `redirect-test-${Date.now()}@example.com`;
    console.log(`\n2. Creating user with email: ${testEmail}`);
    const user = await trpcClient.users.create.mutate({
      name: "Redirect Test User",
      email: testEmail,
      phone: "1234567890"
    });
    console.log('User created:', user.id);
    
    // Test 3: Create booking
    console.log('\n3. Creating booking...');
    const booking = await trpcClient.bookings.create.mutate({
      eventId: events[0].id,
      userId: user.id,
      totalAmount: 1000,
      tickets: [
        {
          type: "General Admission",
          quantity: 1,
          price: 1000
        }
      ]
    });
    console.log('Booking created:', booking.id);
    
    // Test 4: Get booking details (what the success page would load)
    console.log('\n4. Loading booking details...');
    const bookingDetails = await trpcClient.bookings.getById.query({ id: booking.id });
    console.log('Booking details loaded successfully');
    console.log('Has QR code:', !!bookingDetails.qrCode);
    
    console.log('\n=== Redirect Flow Test Complete ===');
    console.log('The redirect URL would be:');
    console.log(`http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
  } catch (error) {
    console.error('Redirect Test Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRedirectFlow();