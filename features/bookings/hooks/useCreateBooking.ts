import { useState } from 'react';
import { createParcel, signParcelDeclaration, createBooking } from '../api/bookings.api';
import { BookingDTO, CreateParcelRequest } from '../types/booking.type';
import { getApiErrorMessage } from '../../../shared/utils/api.error.utils';


interface CreateBookingInput {
  parcel: CreateParcelRequest;
  tripId: string;
  requestedKg: number;
  messageToTraveler?: string;
}

interface UseCreateBookingResult {
  loading: boolean;
  error: string;
  step: 'idle' | 'creating_parcel' | 'signing' | 'booking' | 'done';
  submit: (input: CreateBookingInput) => Promise<BookingDTO | null>;
}

export function useCreateBooking(): UseCreateBookingResult {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [step,    setStep]    = useState<UseCreateBookingResult['step']>('idle');

  const submit = async (input: CreateBookingInput): Promise<BookingDTO | null> => {
    setError('');
    setLoading(true);

    try {
      setStep('creating_parcel');
      console.log('Step 1: POST /parcels', JSON.stringify(input.parcel));
      const parcel = await createParcel(input.parcel);
      console.log('✅ Parcel created:', parcel.id);

      setStep('signing');
      console.log('Step 2: POST /parcels/' + parcel.id + '/sign');
      await signParcelDeclaration(parcel.id);
      console.log('✅ Declaration signed');

      setStep('booking');
      console.log('Step 3: POST /bookings');
      const booking = await createBooking({
        tripId: input.tripId,
        parcelId: parcel.id,
        requestedKg: input.requestedKg,
        messageToTraveler: input.messageToTraveler,
      });
      console.log('✅ Booking created:', booking.id, 'status:', booking.status);

      setStep('done');
      return booking;
    } catch (err) {
      console.log('❌ Booking error:', err);
      setError(getApiErrorMessage(err));
      setStep('idle');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, step, submit };
}
