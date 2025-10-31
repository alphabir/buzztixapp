const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== Debugging Checkout Flow ===');
console.log('This will simulate the exact steps a user takes during checkout');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function debugCheckoutFlow() {
  try {
    console.log('\n--- STEP 1: User Browses Events ---');
    const events = await client.events.getAll.query();
    console.log(`✓ Found ${events.length} events`);
    
    const event = events[0];
    console.log(`User selects: "${event.title}"`);
    
    console.log('\n--- STEP 2: User Proceeds to Checkout ---');
    const tickets = [
      {
        type: "General Admission",
        quantity: 2,
        price: 750
      }
    ];
    const totalAmount = 1500;
    
    console.log('Selected tickets:', tickets);
    console.log('Total amount: ₹', totalAmount);
    
    console.log('\n--- STEP 3: User Enters Details ---');
    const userData = {
      name: "John Smith",
      email: `johnsmith-${Date.now()}@example.com`,
      phone: "9876543210"
    };
    
    console.log('User information:');
    console.log('  Name:', userData.name);
    console.log('  Email:', userData.email);
    console.log('  Phone:', userData.phone);
    
    console.log('\n--- STEP 4: User Clicks "Pay Now" ---');
    console.log('Processing payment...');
    
    // Create user
    const user = await client.users.create.mutate(userData);
    console.log(`✓ User created with ID: ${user.id}`);
    
    // Create booking
    const booking = await client.bookings.create.mutate({
      eventId: event.id,
      userId: user.id,
      totalAmount: totalAmount,
      tickets: tickets
    });
    console.log(`✓ Booking created with ID: ${booking.id}`);
    
    console.log('\n--- STEP 5: Navigation to Booking Success ---');
    console.log('The frontend should navigate to:');
    console.log(`  Path: /booking-success`);
    console.log(`  Params: { bookingId: "${booking.id}" }`);
    console.log(`  Full URL: http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
    console.log('\n--- STEP 6: Verify Booking Details ---');
    const bookingDetails = await client.bookings.getById.query({ id: booking.id });
    console.log(`✓ Booking details loaded successfully`);
    console.log(`  Event: ${bookingDetails.event.title}`);
    console.log(`  Has QR Code: ${!!bookingDetails.qrCode}`);
    console.log(`  Tickets: ${bookingDetails.tickets.map(t => `${t.type} x ${t.quantity}`).join(', ')}`);
    
    console.log('\n=== CHECKOUT FLOW DEBUG COMPLETE ===');
    console.log('All backend operations work correctly.');
    console.log('If navigation is not working, the issue is in the frontend code.');
    console.log('');
    console.log('Test the booking success page directly:');
    console.log(`http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
  } catch (error) {
    console.error('Checkout Flow Debug Failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

debugCheckoutFlow();