import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  acceptBooking,
  rejectBooking,
  markPickedUp,
  markDelivered,
  confirmDelivery,
  cancelBooking,
} from '../api/bookings.api';
import { BookingDTO } from '../types/booking.type';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';


interface UseBookingActionsResult {
  loading: boolean;
  error: string;
  accept:   (bookingId: string) => Promise<BookingDTO | null>;
  reject:   (bookingId: string, reason?: string) => Promise<BookingDTO | null>;
  pickUp:   (bookingId: string) => Promise<BookingDTO | null>;
  deliver:  (bookingId: string) => Promise<BookingDTO | null>;
  confirm:  (bookingId: string) => Promise<BookingDTO | null>;
  cancel:   (bookingId: string) => Promise<BookingDTO | null>;
}

export function useBookingActions(): UseBookingActionsResult {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const wrap = async (fn: () => Promise<BookingDTO>): Promise<BookingDTO | null> => {
    setLoading(true);
    setError('');
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(getApiErrorMessage(err, t));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    accept:  (id)         => wrap(() => acceptBooking(id)),
    reject:  (id, reason) => wrap(() => rejectBooking(id, reason)),
    pickUp:  (id)         => wrap(() => markPickedUp(id)),
    deliver: (id)         => wrap(() => markDelivered(id)),
    confirm: (id)         => wrap(() => confirmDelivery(id)),
    cancel:  (id)         => wrap(() => cancelBooking(id)),
  };
}
