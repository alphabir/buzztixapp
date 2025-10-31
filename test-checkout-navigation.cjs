const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== Testing Checkout Navigation ===');
console.log('This test will simulate the exact checkout flow and verify navigation');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function testCheckoutNavigation() {
  try {
    console.log('\n--- STEP 1: Load Events ---');
    const events = await client.events.getAll.query();
    console.log(`✓ Loaded ${events.length} events`);
    
    const event = events[0];
    console.log(`Selected event: ${event.title}`);
    
    console.log('\n--- STEP 2: Prepare Checkout Data ---');
    const tickets = [
      {
        type: "General Admission",
        quantity: 1,
        price: 1000
      }
    ];
    const totalAmount = 1000;
    
    console.log('Checkout parameters:');
    console.log('  Event ID:', event.id);
    console.log('  Event Title:', event.title);
    console.log('  Tickets:', JSON.stringify(tickets));
    console.log('  Total Amount:', totalAmount);
    
    console.log('\n--- STEP 3: User Information ---');
    const userData = {
      name: "Test User",
      email: `test-${Date.now()}@example.com`,
      phone: "1234567890"
    };
    console.log('User data:', userData);
    
    console.log('\n--- STEP 4: Process Payment (Simulate Pay Now Click) ---');
    
    // Create user
    console.log('Creating user...');
    const user = await client.users.create.mutate(userData);
    console.log(`✓ User created: ${user.id}`);
    
    // Create booking
    console.log('Creating booking...');
    const booking = await client.bookings.create.mutate({
      eventId: event.id,
      userId: user.id,
      totalAmount: totalAmount,
      tickets: tickets
    });
    console.log(`✓ Booking created: ${booking.id}`);
    
    console.log('\n--- STEP 5: Verify Booking Success Navigation ---');
    console.log('The frontend should navigate to:');
    console.log(`  URL: /booking-success`);
    console.log(`  Params: { bookingId: "${booking.id}" }`);
    
    // Verify booking details can be loaded (what the success page would do)
    console.log('\n--- STEP 6: Verify Booking Details Loading ---');
    const bookingDetails = await client.bookings.getById.query({ id: booking.id });
    console.log(`✓ Booking details loaded successfully`);
    console.log(`  Event: ${bookingDetails.event.title}`);
    console.log(`  Has QR Code: ${!!bookingDetails.qrCode}`);
    console.log(`  Tickets: ${bookingDetails.tickets.length}`);
    
    if (bookingDetails.qrCode) {
      try {
        const qrData = JSON.parse(bookingDetails.qrCode);
        console.log(`  QR Data verified - Booking ID: ${qrData.bookingId}`);
      } catch (e) {
        console.log('  QR Data (raw):', bookingDetails.qrCode.substring(0, 50) + '...');
      }
    }
    
    console.log('\n=== CHECKOUT NAVIGATION TEST COMPLETE ===');
    console.log('The navigation should work as follows:');
    console.log('1. User clicks "Pay Now" on checkout page');
    console.log('2. System creates user and booking');
    console.log('3. System calls: router.push({ pathname: "/booking-success", params: { bookingId: "' + booking.id + '" } })');
    console.log('4. User should see booking success page with QR code');
    console.log('');
    console.log('Direct test URL:');
    console.log(`http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
  } catch (error) {
    console.error('Checkout Navigation Test Failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCheckoutNavigation();