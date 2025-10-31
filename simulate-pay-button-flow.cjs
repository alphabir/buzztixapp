const { createTRPCProxyClient, httpBatchLink } = require('@trpc/client');
const superjson = require('superjson');

console.log('=== Simulating Complete Pay Button Flow ===');
console.log('This simulates exactly what happens when a user clicks the Pay button');

// Create a TRPC client that matches the frontend configuration
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:8081/trpc',
      transformer: superjson,
    }),
  ],
});

async function simulatePayButtonFlow() {
  try {
    console.log('\n--- STEP 1: User clicks Pay button ---');
    console.log('Form data submitted:');
    const formData = {
      name: "Pay Button Test User",
      email: `paybutton-${Date.now()}@example.com`,
      phone: "9876543210",
      cardNumber: "1234567890123456",
      expiryDate: "12/25",
      cvv: "123"
    };
    console.log(formData);
    
    console.log('\n--- STEP 2: Create or retrieve user ---');
    let user;
    try {
      user = await client.users.create.mutate({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      console.log(`✓ User created: ${user.id}`);
    } catch (userError) {
      if (userError.message && userError.message.includes("Unique constraint failed")) {
        // Try to get existing user
        try {
          const existingUser = await client.users.getByEmail.query({ email: formData.email });
          user = existingUser;
          console.log(`✓ Retrieved existing user: ${user.id}`);
        } catch (getUserError) {
          console.log('✗ Failed to retrieve existing user');
          throw getUserError;
        }
      } else {
        throw userError;
      }
    }
    
    console.log('\n--- STEP 3: Create booking ---');
    const bookingData = {
      eventId: "ce9445e6-3543-4913-b9d2-121e0906f93f", // Warehouse Nights
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
    console.log(`✓ QR Code generated and stored: ${!!booking.qrCode}`);
    
    console.log('\n--- STEP 4: Navigation to booking success page ---');
    console.log('This is what the frontend should do after booking creation:');
    console.log(`router.push({`);
    console.log(`  pathname: "/booking-success",`);
    console.log(`  params: { bookingId: "${booking.id}" }`);
    console.log(`})`);
    
    console.log('\n--- STEP 5: Verify booking success page can load ---');
    const bookingDetails = await client.bookings.getById.query({ id: booking.id });
    console.log(`✓ Booking details loaded successfully`);
    console.log(`  Event: ${bookingDetails.event.title}`);
    console.log(`  Has QR Code: ${!!bookingDetails.qrCode}`);
    console.log(`  QR Code data: ${bookingDetails.qrCode.substring(0, 50)}...`);
    
    console.log('\n=== PAY BUTTON FLOW SIMULATION COMPLETE ===');
    console.log('✅ The pay button flow works correctly!');
    console.log('');
    console.log('Direct test URL:');
    console.log(`http://localhost:8082/booking-success?bookingId=${booking.id}`);
    
  } catch (error) {
    console.error('❌ Pay Button Flow Simulation Failed:', error.message);
  }
}

simulatePayButtonFlow();