import { create } from 'zustand';

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'CANCELLED';

export interface ActiveBooking {
  id: string;
  tripId: string;
  parcelId: string;
  status: BookingStatus;
  from: string;
  to: string;
  departureDate: string;
  totalAmount: number;
  unreadMessages: number;
}

interface BookingState {
  activeBookings: ActiveBooking[];
  setActiveBookings: (bookings: ActiveBooking[]) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  clearUnreadMessages: (bookingId: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  activeBookings: [],

  setActiveBookings: (bookings) => set({ activeBookings: bookings }),

  updateBookingStatus: (id, status) =>
    set((state) => ({
      activeBookings: state.activeBookings.map((b) =>
        b.id === id ? { ...b, status } : b,
      ),
    })),

  clearUnreadMessages: (bookingId) =>
    set((state) => ({
      activeBookings: state.activeBookings.map((b) =>
        b.id === bookingId ? { ...b, unreadMessages: 0 } : b,
      ),
    })),
}));
