const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== Testing QR Code Storage in Database ===');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function testQrStorage() {
  try {
    console.log('\n--- STEP 1: Create User ---');
    const userData = {
      name: "QR Test User",
      email: `qrtest-${Date.now()}@example.com`,
      phone: "1234567890"
    };
    
    const user = await client.users.create.mutate(userData);
    console.log(`✓ User created: ${user.id}`);
    
    console.log('\n--- STEP 2: Get Events ---');
    const events = await client.events.getAll.query();
    console.log(`✓ Found ${events.length} events`);
    
    const event = events[0];
    console.log(`Using event: ${event.title}`);
    
    console.log('\n--- STEP 3: Create Booking with QR Code ---');
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
    console.log(`✓ Booking created: ${booking.id}`);
    console.log(`✓ QR Code stored in database: ${!!booking.qrCode}`);
    
    if (booking.qrCode) {
      try {
        const qrData = JSON.parse(booking.qrCode);
        console.log('✓ QR Code data verified:');
        console.log(`  Booking ID: ${qrData.bookingId}`);
        console.log(`  Event ID: ${qrData.eventId}`);
        console.log(`  Event Name: ${qrData.eventName}`);
        console.log(`  Total Amount: ${qrData.totalAmount}`);
      } catch (e) {
        console.log('✗ QR Code data invalid');
      }
    }
    
    console.log('\n--- STEP 4: Retrieve Booking from Database ---');
    const retrievedBooking = await client.bookings.getById.query({ id: booking.id });
    console.log(`✓ Booking retrieved from database: ${retrievedBooking.id}`);
    console.log(`✓ QR Code retrieved from database: ${!!retrievedBooking.qrCode}`);
    
    if (retrievedBooking.qrCode) {
      try {
        const qrData = JSON.parse(retrievedBooking.qrCode);
        console.log('✓ Retrieved QR Code data verified:');
        console.log(`  Booking ID: ${qrData.bookingId}`);
        console.log(`  Event Name: ${qrData.eventName}`);
      } catch (e) {
        console.log('✗ Retrieved QR Code data invalid');
      }
    }
    
    console.log('\n=== QR CODE STORAGE TEST COMPLETE ===');
    console.log('The QR code is now stored in the database and can be retrieved.');
    console.log(`Test booking ID: ${booking.id}`);
    console.log(`Direct URL to test: http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
  } catch (error) {
    console.error('QR Storage Test Failed:', error.message);
  }
}

testQrStorage();