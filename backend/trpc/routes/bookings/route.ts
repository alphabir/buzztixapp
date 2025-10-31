import { z } from "zod";
import { publicProcedure } from "../../create-context.ts";

const TicketInput = z.object({
  type: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const createBooking = publicProcedure
  .input(
    z.object({
      eventId: z.string(),
      userId: z.string(),
      totalAmount: z.number(),
      tickets: z.array(TicketInput),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Generate QR code data
    const qrCodeData = JSON.stringify({
      bookingId: "", // Will be filled after booking creation
      eventId: input.eventId,
      totalAmount: input.totalAmount,
      timestamp: new Date().toISOString()
    });
    
    const booking = await ctx.prisma.booking.create({
      data: {
        eventId: input.eventId,
        userId: input.userId,
        totalAmount: input.totalAmount,
        qrCode: qrCodeData, // Store QR code data in DB
        tickets: {
          create: input.tickets.map((ticket) => ({
            type: ticket.type,
            quantity: ticket.quantity,
            price: ticket.price,
          })),
        },
      },
      include: {
        tickets: true,
        event: true,
        user: true,
      },
    });
    
    // Update QR code with actual booking ID
    const finalQrCodeData = JSON.stringify({
      bookingId: booking.id,
      eventId: booking.eventId,
      eventName: booking.event.title,
      eventDate: booking.event.date,
      venue: booking.event.venue,
      totalAmount: booking.totalAmount,
      timestamp: new Date().toISOString()
    });
    
    const updatedBooking = await ctx.prisma.booking.update({
      where: { id: booking.id },
      data: { qrCode: finalQrCodeData },
      include: {
        tickets: true,
        event: true,
        user: true,
      },
    });
    
    // Return booking with QR code data
    return updatedBooking;
  });

export const getUserBookings = publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const bookings = await ctx.prisma.booking.findMany({
      where: { userId: input.userId },
      include: {
        tickets: true,
        event: true,
        user: true,
      },
    });
    
    return bookings;
  });

export const getBookingById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const booking = await ctx.prisma.booking.findUnique({
      where: { id: input.id },
      include: {
        tickets: true,
        event: true,
        user: true,
      },
    });
    
    return booking;
  });

export const cancelBooking = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const booking = await ctx.prisma.booking.update({
      where: { id: input.id },
      data: { status: "cancelled" },
    });
    return booking;
  });