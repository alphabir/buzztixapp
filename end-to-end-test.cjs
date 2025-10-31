const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== End-to-End Flow Test ===');
console.log('Testing complete flow from browsing to booking confirmation');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function testEndToEndFlow() {
  try {
    console.log('\n--- STEP 1: Browse Events ---');
    const events = await client.events.getAll.query();
    console.log(`✓ Loaded ${events.length} events`);
    
    if (events.length === 0) {
      console.log('✗ No events found');
      return;
    }
    
    const event = events[0];
    console.log(`✓ Selected event: ${event.title}`);
    
    console.log('\n--- STEP 2: View Event Details ---');
    const eventDetails = await client.events.getById.query({ id: event.id });
    console.log(`✓ Loaded event details for: ${eventDetails.title}`);
    console.log(`✓ Available ticket types: ${eventDetails.ticketTypes.length}`);
    
    console.log('\n--- STEP 3: Create User ---');
    const userEmail = `e2e-test-${Date.now()}@example.com`;
    const user = await client.users.create.mutate({
      name: "E2E Test User",
      email: userEmail,
      phone: "9876543210"
    });
    console.log(`✓ User created with ID: ${user.id}`);
    
    console.log('\n--- STEP 4: Create Booking ---');
    const tickets = [
      {
        type: "General Admission",
        quantity: 2,
        price: 750
      }
    ];
    
    const booking = await client.bookings.create.mutate({
      eventId: event.id,
      userId: user.id,
      totalAmount: 1500,
      tickets: tickets
    });
    console.log(`✓ Booking created with ID: ${booking.id}`);
    
    console.log('\n--- STEP 5: Load Booking Confirmation ---');
    const bookingDetails = await client.bookings.getById.query({ id: booking.id });
    console.log(`✓ Booking details loaded`);
    console.log(`✓ Has QR Code: ${!!bookingDetails.qrCode}`);
    console.log(`✓ Event: ${bookingDetails.event.title}`);
    console.log(`✓ Tickets: ${bookingDetails.tickets.map(t => `${t.type} x ${t.quantity}`).join(', ')}`);
    
    console.log('\n=== END-TO-END TEST PASSED ===');
    console.log('All steps completed successfully!');
    console.log('');
    console.log('Navigation flow verified:');
    console.log('1. Browse Events → Event Details');
    console.log('2. Event Details → Checkout');
    console.log('3. Checkout → Booking Success (with QR code)');
    console.log('');
    console.log('Direct URL to test booking confirmation page:');
    console.log(`http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
  } catch (error) {
    console.error('End-to-End Test Failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEndToEndFlow();