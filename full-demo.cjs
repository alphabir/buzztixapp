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

async function fullDemoFlow() {
  try {
    console.log('=== Full Demo: Complete Booking Flow ===');
    
    // Step 1: Get events (simulating user browsing events)
    console.log('\n1. Loading events...');
    const events = await client.events.getAll.query();
    const event = events[0]; // Select first event
    console.log(`Selected event: ${event.title}`);
    
    // Step 2: User fills checkout form (simulating frontend form submission)
    const userData = {
      name: "John Doe",
      email: `johndoe-${Date.now()}@example.com`,
      phone: "9876543210"
    };
    
    console.log(`\n2. User filling checkout form:`);
    console.log(`   Name: ${userData.name}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Phone: ${userData.phone}`);
    
    // Step 3: Payment processing (simulating clicking "Pay Now")
    console.log('\n3. Processing payment...');
    
    // Create user
    const user = await client.users.create.mutate(userData);
    console.log('   User account created');
    
    // Create booking
    const bookingData = {
      eventId: event.id,
      userId: user.id,
      totalAmount: 1500,
      tickets: [
        {
          type: "General Admission",
          quantity: 2,
          price: 750
        }
      ]
    };
    
    const booking = await client.bookings.create.mutate(bookingData);
    console.log('   Booking confirmed');
    
    // Step 4: Load booking confirmation page (simulating redirect)
    console.log('\n4. Loading booking confirmation page...');
    const confirmedBooking = await client.bookings.getById.query({ id: booking.id });
    
    console.log('\n=== BOOKING CONFIRMED ===');
    console.log(`Booking ID: ${confirmedBooking.id}`);
    console.log(`Event: ${confirmedBooking.event.title}`);
    console.log(`Date: ${confirmedBooking.event.date}`);
    console.log(`Time: ${confirmedBooking.event.time}`);
    console.log(`Venue: ${confirmedBooking.event.venue}`);
    console.log(`Tickets: ${confirmedBooking.tickets.map(t => `${t.type} x ${t.quantity}`).join(', ')}`);
    console.log(`Total: ₹${confirmedBooking.totalAmount}`);
    console.log(`Has QR Code: ${!!confirmedBooking.qrCode}`);
    
    // Show QR code content
    if (confirmedBooking.qrCode) {
      const qrData = JSON.parse(confirmedBooking.qrCode);
      console.log('\n=== QR CODE CONTENT ===');
      console.log(`Booking ID: ${qrData.bookingId}`);
      console.log(`Event: ${qrData.eventName}`);
      console.log(`Date: ${qrData.eventDate}`);
      console.log(`Venue: ${qrData.venue}`);
      console.log(`Amount: ₹${qrData.totalAmount}`);
    }
    
    console.log('\n=== COMPLETE FLOW SUCCESSFUL ===');
    console.log('The user would now see the enhanced booking confirmed page with:');
    console.log('- Large QR code for event entry');
    console.log('- Event details and booking information');
    console.log('- Payment receipt');
    console.log('- Next steps guidance');
    
    // Generate the URL that would be used in the app
    console.log(`\n=== APP REDIRECT URL ===`);
    console.log(`http://localhost:8082/booking-success?bookingId=${confirmedBooking.id}`);
    
  } catch (error) {
    console.error('Demo Error:', error.message);
  }
}

fullDemoFlow();