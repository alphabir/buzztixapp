import { PrismaClient } from '@prisma/client';
import { EVENTS } from '../mocks/events.ts';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    },
  });

  console.log('Created test user:', user);

  // Create events from mock data
  for (const event of EVENTS) {
    const createdEvent = await prisma.event.create({
      data: {
        title: event.title,
        artist: event.artist,
        date: event.date,
        time: event.time,
        venue: event.venue,
        location: event.location,
        price: event.price,
        category: event.category,
        image: event.image,
        description: event.description,
        lineup: event.lineup || [],
        isFeatured: event.isFeatured || false,
      },
    });

    console.log(`Created event: ${createdEvent.title}`);

    // Create ticket types for each event
    for (const ticketType of event.ticketTypes) {
      await prisma.ticketType.create({
        data: {
          name: ticketType.name,
          price: ticketType.price,
          description: ticketType.description,
          available: ticketType.available,
          eventId: createdEvent.id,
        },
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });