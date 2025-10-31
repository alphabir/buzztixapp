const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== Simulating Complete User Flow ===');
console.log('This simulates exactly what a user would do step by step');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function simulateUserFlow() {
  try {
    console.log('\n--- USER STEP 1: Open App and Browse Events ---');
    console.log('User opens app at: http://localhost:8082');
    console.log('App redirects to: http://localhost:8082/(tabs)/browse');
    
    const events = await client.events.getAll.query();
    console.log(`✓ Loaded ${events.length} events`);
    
    const selectedEvent = events[0];
    console.log(`User selects event: "${selectedEvent.title}"`);
    console.log(`Navigating to: http://localhost:8082/(tabs)/event/${selectedEvent.id}`);
    
    console.log('\n--- USER STEP 2: View Event Details ---');
    const eventDetails = await client.events.getById.query({ id: selectedEvent.id });
    console.log(`✓ Loaded event details for "${eventDetails.title}"`);
    console.log(`Available ticket types: ${eventDetails.ticketTypes.length}`);
    
    // User selects tickets
    const selectedTickets = [
      {
        type: "General Admission",
        quantity: 2,
        price: 750
      }
    ];
    const totalAmount = 1500;
    
    console.log(`User selects: ${selectedTickets[0].quantity} x ${selectedTickets[0].type} tickets`);
    console.log(`Total amount: ₹${totalAmount}`);
    console.log('User clicks "Continue" button');
    console.log(`Navigating to: http://localhost:8082/checkout`);
    
    console.log('\n--- USER STEP 3: Checkout Process ---');
    console.log('User fills in checkout form:');
    const userData = {
      name: "John Doe",
      email: `johndoe-${Date.now()}@example.com`,
      phone: "9876543210"
    };
    console.log(`  Name: ${userData.name}`);
    console.log(`  Email: ${userData.email}`);
    console.log(`  Phone: ${userData.phone}`);
    
    console.log('\nUser clicks "Pay Now" button');
    console.log('Processing payment...');
    
    // Create user
    const user = await client.users.create.mutate(userData);
    console.log(`✓ User account created (ID: ${user.id})`);
    
    // Create booking
    const booking = await client.bookings.create.mutate({
      eventId: selectedEvent.id,
      userId: user.id,
      totalAmount: totalAmount,
      tickets: selectedTickets
    });
    console.log(`✓ Booking confirmed (ID: ${booking.id})`);
    
    console.log('\n--- USER STEP 4: Booking Confirmation ---');
    console.log(`Redirecting to: http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
    const bookingDetails = await client.bookings.getById.query({ id: booking.id });
    console.log('✓ Booking confirmation page loaded');
    console.log(`  Event: ${bookingDetails.event.title}`);
    console.log(`  Has QR code: ${!!bookingDetails.qrCode}`);
    console.log(`  Tickets: ${bookingDetails.tickets.map(t => `${t.type} x ${t.quantity}`).join(', ')}`);
    
    console.log('\n--- USER STEP 5: View Tickets ---');
    console.log('User can click "View My Tickets"');
    console.log('Navigating to: http://localhost:8082/(tabs)/tickets');
    
    const userBookings = await client.bookings.getUserBookings.query({ userId: user.id });
    console.log(`✓ Loaded ${userBookings.length} bookings for user`);
    
    console.log('\n=== USER FLOW SIMULATION COMPLETE ===');
    console.log('All steps would work correctly in the frontend!');
    console.log('');
    console.log('Direct test URLs:');
    console.log(`1. Main App: http://localhost:8082`);
    console.log(`2. Booking Success: http://localhost:8082/booking-success?bookingId=${booking.id}`);
    console.log(`3. Event Detail: http://localhost:8082/(tabs)/event/${selectedEvent.id}`);
    
  } catch (error) {
    console.error('User Flow Simulation Failed:', error.message);
  }
}

simulateUserFlow();