import { z } from "zod";
import { publicProcedure } from "../../create-context.ts";

export const getAllEvents = publicProcedure.query(async ({ ctx }) => {
  const events = await ctx.prisma.event.findMany({
    include: {
      ticketTypes: true,
    },
  });
  return events;
});

export const getEventById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const event = await ctx.prisma.event.findUnique({
      where: { id: input.id },
      include: {
        ticketTypes: true,
      },
    });
    return event;
  });

export const getEventsByCategory = publicProcedure
  .input(z.object({ category: z.string() }))
  .query(async ({ ctx, input }) => {
    const events = await ctx.prisma.event.findMany({
      where: { category: input.category },
      include: {
        ticketTypes: true,
      },
    });
    return events;
  });

export const getEventsByLocation = publicProcedure
  .input(z.object({ location: z.string() }))
  .query(async ({ ctx, input }) => {
    const events = await ctx.prisma.event.findMany({
      where: { location: input.location },
      include: {
        ticketTypes: true,
      },
    });
    return events;
  });

export const getFeaturedEvents = publicProcedure.query(async ({ ctx }) => {
  const events = await ctx.prisma.event.findMany({
    where: { isFeatured: true },
    include: {
      ticketTypes: true,
    },
  });
  return events;
});