const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== Comprehensive Debug Test ===');
console.log('Testing each step of the complete flow to identify issues');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function debugFullFlow() {
  try {
    console.log('\n--- DEBUG STEP 1: Testing Backend Connection ---');
    try {
      // Test a query instead of a mutation
      const events = await client.events.getAll.query();
      console.log('✓ Backend connection successful');
      console.log(`  Loaded ${events.length} events`);
    } catch (error) {
      console.log('✗ Backend connection failed');
      console.log('  Error:', error.message);
      return;
    }
    
    console.log('\n--- DEBUG STEP 2: Loading Events ---');
    try {
      const events = await client.events.getAll.query();
      console.log(`✓ Events loaded successfully: ${events.length} events`);
      if (events.length > 0) {
        console.log('  Sample event:', {
          id: events[0].id,
          title: events[0].title,
          date: events[0].date
        });
      }
    } catch (error) {
      console.log('✗ Failed to load events');
      console.log('  Error:', error.message);
      return;
    }
    
    console.log('\n--- DEBUG STEP 3: Loading Specific Event ---');
    try {
      const events = await client.events.getAll.query();
      if (events.length > 0) {
        const eventDetails = await client.events.getById.query({ id: events[0].id });
        console.log('✓ Event details loaded successfully');
        console.log('  Event title:', eventDetails.title);
        console.log('  Ticket types available:', eventDetails.ticketTypes.length);
      }
    } catch (error) {
      console.log('✗ Failed to load event details');
      console.log('  Error:', error.message);
      return;
    }
    
    console.log('\n--- DEBUG STEP 4: User Creation ---');
    try {
      const userEmail = `debug-${Date.now()}@example.com`;
      const user = await client.users.create.mutate({
        name: "Debug User",
        email: userEmail,
        phone: "1234567890"
      });
      console.log('✓ User created successfully');
      console.log('  User ID:', user.id);
      console.log('  User email:', user.email);
      
      // Store user ID for next step
      global.debugUserId = user.id;
      global.debugUser = user;
    } catch (error) {
      console.log('✗ Failed to create user');
      console.log('  Error:', error.message);
      return;
    }
    
    console.log('\n--- DEBUG STEP 5: Booking Creation ---');
    try {
      const events = await client.events.getAll.query();
      if (events.length > 0 && global.debugUserId) {
        const booking = await client.bookings.create.mutate({
          eventId: events[0].id,
          userId: global.debugUserId,
          totalAmount: 1000,
          tickets: [
            {
              type: "General Admission",
              quantity: 1,
              price: 1000
            }
          ]
        });
        console.log('✓ Booking created successfully');
        console.log('  Booking ID:', booking.id);
        console.log('  Total amount:', booking.totalAmount);
        
        // Store booking ID for next step
        global.debugBookingId = booking.id;
      }
    } catch (error) {
      console.log('✗ Failed to create booking');
      console.log('  Error:', error.message);
      return;
    }
    
    console.log('\n--- DEBUG STEP 6: Booking Retrieval ---');
    try {
      if (global.debugBookingId) {
        const bookingDetails = await client.bookings.getById.query({ id: global.debugBookingId });
        console.log('✓ Booking details retrieved successfully');
        console.log('  Event:', bookingDetails.event.title);
        console.log('  Has QR code:', !!bookingDetails.qrCode);
        console.log('  Tickets:', bookingDetails.tickets.length);
        
        if (bookingDetails.qrCode) {
          try {
            const qrData = JSON.parse(bookingDetails.qrCode);
            console.log('  QR Data structure verified');
            console.log('  Booking ID in QR:', qrData.bookingId);
          } catch (e) {
            console.log('  QR Data (raw):', bookingDetails.qrCode.substring(0, 100) + '...');
          }
        }
      }
    } catch (error) {
      console.log('✗ Failed to retrieve booking details');
      console.log('  Error:', error.message);
      return;
    }
    
    console.log('\n--- DEBUG STEP 7: User Bookings ---');
    try {
      if (global.debugUserId) {
        const userBookings = await client.bookings.getUserBookings.query({ userId: global.debugUserId });
        console.log('✓ User bookings retrieved successfully');
        console.log('  Number of bookings:', userBookings.length);
      }
    } catch (error) {
      console.log('✗ Failed to retrieve user bookings');
      console.log('  Error:', error.message);
      return;
    }
    
    console.log('\n=== COMPREHENSIVE DEBUG TEST COMPLETE ===');
    console.log('All backend functionality is working correctly!');
    console.log('');
    console.log('If the frontend is not working, the issue is likely in:');
    console.log('1. Navigation/routing between pages');
    console.log('2. Parameter passing between screens');
    console.log('3. Frontend component rendering');
    console.log('');
    console.log('Test URLs to try:');
    if (global.debugBookingId) {
      console.log(`Booking Success Page: http://localhost:8082/booking-success?bookingId=${global.debugBookingId}`);
    }
    console.log('Main App: http://localhost:8082');
    
  } catch (error) {
    console.error('Debug Test Failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugFullFlow();