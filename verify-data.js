const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyData() {
  try {
    // Try to fetch events
    const events = await prisma.event.findMany();
    console.log('Events count:', events.length);
    
    // Try to fetch users
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
    
    // Show first event
    if (events.length > 0) {
      console.log('First event:', events[0].title);
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();