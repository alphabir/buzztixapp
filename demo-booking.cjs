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

async function demoBookingFlow() {
  try {
    console.log('=== Demo: Enhanced Booking Confirmed Page ===');
    
    // Get events
    console.log('\n1. Loading events...');
    const events = await client.events.getAll.query();
    console.log(`Found ${events.length} events`);
    
    // Create a user
    const userEmail = `demo-${Date.now()}@example.com`;
    console.log(`\n2. Creating user with email: ${userEmail}`);
    const user = await client.users.create.mutate({
      name: "Demo User",
      email: userEmail,
      phone: "9876543210"
    });
    console.log('User created successfully');
    
    // Create a booking
    console.log('\n3. Creating booking...');
    const booking = await client.bookings.create.mutate({
      eventId: events[0].id,
      userId: user.id,
      totalAmount: 2500,
      tickets: [
        {
          type: "VIP Pass",
          quantity: 2,
          price: 1250
        }
      ]
    });
    console.log('Booking created successfully');
    
    // Retrieve the booking with QR code
    console.log('\n4. Retrieving booking details...');
    const bookingDetails = await client.bookings.getById.query({ id: booking.id });
    
    console.log('\n=== Booking Confirmed Page Data ===');
    console.log('Booking ID:', bookingDetails.id);
    console.log('Event:', bookingDetails.event.title);
    console.log('Has QR Code:', !!bookingDetails.qrCode);
    console.log('Total Amount: ₹', bookingDetails.totalAmount);
    console.log('Tickets:', bookingDetails.tickets.map(t => `${t.type} x ${t.quantity}`).join(', '));
    
    // Parse QR code data
    if (bookingDetails.qrCode) {
      try {
        const qrData = JSON.parse(bookingDetails.qrCode);
        console.log('\n=== QR Code Content ===');
        console.log('Booking ID:', qrData.bookingId);
        console.log('Event Name:', qrData.eventName);
        console.log('Event Date:', qrData.eventDate);
        console.log('Venue:', qrData.venue);
        console.log('Total Amount: ₹', qrData.totalAmount);
      } catch (e) {
        console.log('QR Code data:', bookingDetails.qrCode);
      }
    }
    
    console.log('\n=== Demo Complete ===');
    console.log('The enhanced booking confirmed page would display all this information with a large QR code, event details, and payment receipt.');
    
  } catch (error) {
    console.error('Demo Error:', error.message);
  }
}

demoBookingFlow();