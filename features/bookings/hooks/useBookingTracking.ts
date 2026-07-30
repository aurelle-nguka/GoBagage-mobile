import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getBooking, confirmDelivery } from '../api/bookings.api';
import { BookingDTO, BookingStatus } from '../types/booking.type';

export interface TrackingData {
  bookingId: string;
  status: BookingStatus;
  progressPercent: number;
  from: string;
  to: string;
  departureDate: string;
  totalAmountCad: number;
  parcel: {
    description: string;
    category: string;
    weightKg: number;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
  };
  traveler: {
    initials: string;
    name: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
  };
}

interface UseBookingTrackingResult {
  data: TrackingData | null;
  loading: boolean;
  error: string;
  confirming: boolean;
  refresh: () => void;
  confirm: () => Promise<boolean>;
}

const STATUS_PROGRESS: Record<BookingStatus, number> = {
  PENDING:              0,
  AWAITING_ACCEPTANCE:  10,
  ACCEPTED:             25,
  PICKED_UP:            50,
  IN_TRANSIT:           70,
  DELIVERED:            90,
  CONFIRMED:            100,
  REJECTED:             0,
  CANCELLED:            0,
};

export function useBookingTracking(bookingId: string): UseBookingTrackingResult {
  const { t } = useTranslation();
  const [data,       setData]       = useState<TrackingData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [confirming, setConfirming] = useState(false);
  const [tick,       setTick]       = useState(0);

  const load = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    setError('');
    try {
      const booking = await getBooking(bookingId);
      console.log('=== BOOKING DETAIL ===');
      console.log(JSON.stringify(booking));
      setData(mapBookingToTracking(booking));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('tracking.errors.load_failed', 'Failed to load tracking.'));
    } finally {
      setLoading(false);
    }
  }, [bookingId, tick]);

  useEffect(() => { load(); }, [load]);

  const confirm = async (): Promise<boolean> => {
    setConfirming(true);
    try {
      await confirmDelivery(bookingId);
      setTick((t) => t + 1);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('tracking.errors.confirm_failed', 'Failed to confirm delivery.'));
      return false;
    } finally {
      setConfirming(false);
    }
  };

  return { data, loading, error, confirming, refresh: () => setTick((t) => t + 1), confirm };
}

function mapBookingToTracking(booking: BookingDTO): TrackingData {
  const traveler = booking.traveler ?? booking.trip?.traveler;
  const corridor = booking.trip?.corridor;

  const firstName = traveler?.firstName ?? 'Traveler';
  const lastInit  = traveler?.lastNameInitial ?? '';

  return {
    bookingId:       String(booking.id),
    status:          booking.status,
    progressPercent: STATUS_PROGRESS[booking.status] ?? 0,
    from:            corridor?.departureCity ?? 'Unknown',
    to:              corridor?.arrivalCity   ?? 'Unknown',
    departureDate:   booking.trip?.departureDate ?? '',
    totalAmountCad:  booking.totalAmountCad ?? 0,
    parcel: {
      description:    booking.parcel?.description    ?? 'Parcel',
      category:       booking.parcel?.category       ?? 'OTHER',
      weightKg:       booking.requestedKg            ?? 0,
      recipientName:  booking.parcel?.recipientName  ?? '',
      recipientPhone: booking.parcel?.recipientPhone ?? '',
      recipientAddress: booking.parcel?.recipientAddress ?? '',
    },
    traveler: {
      initials:    `${firstName[0]}${lastInit}`.toUpperCase(),
      name:        `${firstName} ${lastInit}`.trim(),
      rating:      traveler?.averageRating ?? 0,
      reviewCount: traveler?.totalDeliveries ?? 0,
      verified:    traveler?.kycVerified ?? false,
    },
  };
}