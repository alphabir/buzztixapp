import { createTRPCRouter } from "./create-context.ts";
import hiRoute from "./routes/example/hi/route.ts";
import * as eventRoutes from "./routes/events/route.ts";
import * as bookingRoutes from "./routes/bookings/route.ts";
import * as userRoutes from "./routes/users/route.ts";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  events: createTRPCRouter({
    getAll: eventRoutes.getAllEvents,
    getById: eventRoutes.getEventById,
    getByCategory: eventRoutes.getEventsByCategory,
    getByLocation: eventRoutes.getEventsByLocation,
    getFeatured: eventRoutes.getFeaturedEvents,
  }),
  bookings: createTRPCRouter({
    create: bookingRoutes.createBooking,
    getUserBookings: bookingRoutes.getUserBookings,
    getById: bookingRoutes.getBookingById,
    cancel: bookingRoutes.cancelBooking,
  }),
  users: createTRPCRouter({
    create: userRoutes.createUser,
    getById: userRoutes.getUserById,
    getByEmail: userRoutes.getUserByEmail,
  }),
});

export type AppRouter = typeof appRouter;