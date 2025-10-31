import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TicketType = {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
};

export type BookedTicket = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventLocation: string;
  tickets: {
    type: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  bookingDate: string;
  status: "confirmed" | "cancelled";
};

type BookingState = {
  bookedTickets: BookedTicket[];
  isLoading: boolean;
};

const STORAGE_KEY = "@booked_tickets";

export const [BookingProvider, useBooking] = createContextHook(() => {
  const [state, setState] = useState<BookingState>({
    bookedTickets: [],
    isLoading: true,
  });

  useEffect(() => {
    loadBookedTickets();
  }, []);

  const loadBookedTickets = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const tickets = JSON.parse(stored);
        setState({ bookedTickets: tickets, isLoading: false });
      } else {
        setState({ bookedTickets: [], isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load tickets:", error);
      setState({ bookedTickets: [], isLoading: false });
    }
  };

  const saveTickets = async (tickets: BookedTicket[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error("Failed to save tickets:", error);
    }
  };

  const addBooking = useCallback(async (booking: Omit<BookedTicket, "id" | "bookingDate" | "status">) => {
    const newBooking: BookedTicket = {
      ...booking,
      id: `T${Date.now()}`,
      bookingDate: new Date().toISOString(),
      status: "confirmed",
    };

    const updatedTickets = [...state.bookedTickets, newBooking];
    setState({ ...state, bookedTickets: updatedTickets });
    await saveTickets(updatedTickets);
    return newBooking;
  }, [state]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    const updatedTickets = state.bookedTickets.map((ticket) =>
      ticket.id === bookingId ? { ...ticket, status: "cancelled" as const } : ticket
    );
    setState({ ...state, bookedTickets: updatedTickets });
    await saveTickets(updatedTickets);
  }, [state]);

  const getActiveTickets = useCallback(() => {
    return state.bookedTickets.filter((ticket) => ticket.status === "confirmed");
  }, [state.bookedTickets]);

  return useMemo(() => ({
    ...state,
    addBooking,
    cancelBooking,
    getActiveTickets,
  }), [state, addBooking, cancelBooking, getActiveTickets]);
});
