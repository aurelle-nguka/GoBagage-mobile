/**
 * Go Bagage — Modale Trip Requests
 */

import { useRouter, useLocalSearchParams } from 'expo-router'
import { TripRequestsScreen } from '../../../features/trips/screens/TripRequestsScreen'

export default function TripRequestsPage() {
  const router = useRouter()
  const { tripId } = useLocalSearchParams<{ tripId: string }>()

  // TODO: remplacer par features/trips/hooks/useTripDetail(tripId) → GET /trips/{id}
  return (
    <TripRequestsScreen
      tripId={tripId}
      from='Montreal'
      to='Douala'
      departureDate='Jun 18, 2026'
      availableKg={15}
      onBack={() => router.back()}
      onOpenBooking={(bookingId) =>
        router.push(`/(modals)/traveler-booking/${bookingId}`)
      }
    />
  )
}
