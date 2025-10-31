const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== Complete Booking Flow Demo ===');
console.log('This demo simulates the entire user experience from browsing to booking confirmation.');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function demoCompleteFlow() {
  try {
    console.log('\n--- STEP 1: User Browses Events ---');
    const events = await client.events.getAll.query();
    const selectedEvent = events[0];
    console.log(`User selects: ${selectedEvent.title}`);
    
    console.log('\n--- STEP 2: User Proceeds to Checkout ---');
    const tickets = [
      {
        type: "VIP Pass",
        quantity: 2,
        price: 1500
      }
    ];
    const totalAmount = 3000;
    console.log(`Selected tickets: ${tickets[0].type} x ${tickets[0].quantity}`);
    console.log(`Total amount: ₹${totalAmount}`);
    
    console.log('\n--- STEP 3: User Fills Checkout Form ---');
    const userData = {
      name: "Alice Johnson",
      email: `alice-${Date.now()}@example.com`,
      phone: "9876543210"
    };
    console.log(`Name: ${userData.name}`);
    console.log(`Email: ${userData.email}`);
    console.log(`Phone: ${userData.phone}`);
    
    console.log('\n--- STEP 4: User Clicks "Pay Now" ---');
    console.log('Processing payment...');
    
    // Create user
    const user = await client.users.create.mutate(userData);
    console.log('✓ User account created');
    
    // Create booking
    const booking = await client.bookings.create.mutate({
      eventId: selectedEvent.id,
      userId: user.id,
      totalAmount: totalAmount,
      tickets: tickets
    });
    console.log('✓ Booking confirmed');
    
    console.log('\n--- STEP 5: Redirect to Booking Success Page ---');
    const bookingDetails = await client.bookings.getById.query({ id: booking.id });
    console.log('✓ Loading booking confirmation page');
    console.log(`✓ Booking ID: ${bookingDetails.id}`);
    console.log(`✓ Has QR Code: ${!!bookingDetails.qrCode}`);
    
    console.log('\n=== FLOW COMPLETED SUCCESSFULLY ===');
    console.log('The user would now see the enhanced booking confirmed page with:');
    console.log('- Large QR code for event entry');
    console.log('- Event details and booking information');
    console.log('- Payment receipt');
    console.log('- Next steps guidance');
    
    console.log('\n=== DIRECT ACCESS URL ===');
    console.log(`You can view the booking confirmation page directly at:`);
    console.log(`http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
  } catch (error) {
    console.error('Demo Error:', error.message);
  }
}

demoCompleteFlow();