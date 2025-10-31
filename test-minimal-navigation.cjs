console.log('=== Minimal Navigation Test ===');

// Test the exact navigation parameters that should work
const testBookingId = '165add89-0aad-419b-a631-2b4b6a9f3e1e';

console.log('Testing navigation with the following parameters:');
console.log('Pathname: /booking-success');
console.log('Params: { bookingId: "' + testBookingId + '" }');

console.log('\nThis should result in the URL:');
console.log('http://localhost:8082/booking-success?bookingId=' + testBookingId);

console.log('\nIf this URL works in your browser, then the issue is in the checkout page navigation.');
console.log('If this URL does not work, then there is an issue with the booking-success page.');

console.log('\n=== Test Complete ===');