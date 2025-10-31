console.log('=== Testing Pay Button Navigation ===');

// Test the exact flow that should happen when user clicks Pay button
const testData = {
  eventId: "ce9445e6-3543-4913-b9d2-121e0906f93f",
  userId: "e5d07e17-9c54-4342-b817-5ff96d27b095",
  totalAmount: 1500,
  tickets: [
    {
      type: "General Admission",
      quantity: 2,
      price: 750
    }
  ]
};

console.log('Test data for booking creation:');
console.log(JSON.stringify(testData, null, 2));

console.log('\nExpected navigation after booking creation:');
console.log('router.push({');
console.log('  pathname: "/booking-success",');
console.log('  params: { bookingId: "[generated-booking-id]" }');
console.log('})');

console.log('\nOr fallback navigation:');
console.log('router.push("/booking-success?bookingId=[generated-booking-id]")');

console.log('\n=== Test Complete ===');
console.log('The pay button should execute this exact flow when clicked.');