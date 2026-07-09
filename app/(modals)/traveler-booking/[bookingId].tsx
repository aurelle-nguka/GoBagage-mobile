/**
 * Go Bagage — Modale Traveler Booking
 */

import { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { BookingStatus } from '../../../features/bookings/types/booking.type'
import { TravelerBookingScreen } from '../../../features/bookings/screens/TravelerBookingScreen'

export default function TravelerBookingPage() {
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  // TODO: remplacer par features/bookings/hooks/useBooking(bookingId) → GET /bookings/{id}
  const [status, setStatus] = useState<BookingStatus>('ACCEPTED')

  return (
    <TravelerBookingScreen
      from='Montreal'
      to='Douala'
      departureDate='Jun 18, 2026'
      status={status}
      parcel={{
        description: 'Clothing & family gifts',
        category: 'Clothing',
        weightKg: 4,
        recipientName: 'Jean-Baptiste Mbeki',
      }}
      sender={{ initials: 'ML', name: 'Marie Laurent' }}
      onBack={() => router.back()}
      onChat={() => router.push(`/(modals)/chat/${bookingId}`)}
      onMarkPickedUp={() => {
        // TODO: brancher features/bookings/api/bookings.api.ts → PATCH /bookings/{id}/picked-up
        setStatus('PICKED_UP')
      }}
      onMarkDelivered={() => {
        // TODO: brancher features/bookings/api/bookings.api.ts → PATCH /bookings/{id}/delivered
        setStatus('DELIVERED')
      }}
    />
  )
}
