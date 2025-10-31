import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Try to fetch events
    const events = await prisma.event.findMany();
    console.log('Events count:', events.length);
    
    // Try to fetch users
    const users = await prisma.user.findMany();
    console.log('Users count:', users.length);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();