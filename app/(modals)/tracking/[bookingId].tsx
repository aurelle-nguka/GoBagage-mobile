/**
 * Go Bagage — Modale Tracking
 */

import { useRouter, useLocalSearchParams } from 'expo-router'
import { TrackingScreen } from '../../../features/bookings/screens/TrackingScreen'

export default function TrackingPage() {
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  // TODO: remplacer par features/bookings/hooks/useBookingTracking(bookingId)
  // Données mockées en attendant le branchement API réel sur GET /bookings/{id}
  return (
    <TrackingScreen
      from='Montreal'
      to='Douala'
      departureDate='Jun 18'
      status='IN_TRANSIT'
      progressPercent={68}
      parcel={{
        description: 'Family gifts & clothing',
        category: 'Clothing',
        weightKg: 4,
        recipientName: 'Jean-Baptiste Mbeki',
      }}
      traveler={{
        initials: 'KA',
        name: 'Kofi Asante',
        rating: 4.9,
        reviewCount: 47,
        verified: true,
      }}
      onBack={() => router.back()}
      onChat={() => router.push(`/(modals)/chat/${bookingId}`)}
      onCall={() => {
        // TODO: action d'appel — nécessite que les coordonnées soient déjà partagées (CDC 6.5)
      }}
      onConfirmDelivery={() => {
        // TODO: brancher features/bookings/api/bookings.api.ts → POST /bookings/{id}/confirm
        router.push(`/(modals)/review/${bookingId}`)
      }}
    />
  )
}
