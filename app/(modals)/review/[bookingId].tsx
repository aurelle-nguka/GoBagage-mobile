/**
 * Go Bagage — Modale Review
 */

import { useRouter, useLocalSearchParams } from 'expo-router'
import { ReviewScreen } from '../../../features/reviews/screens/ReviewScreen'

export default function ReviewPage() {
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  // TODO: remplacer par features/bookings/api → GET /bookings/{id} pour les vraies données
  return (
    <ReviewScreen
      routeLabel='Montreal → Douala'
      departureDate='Jun 18, 2026'
      releasedAmount={48}
      revieweeInitials='KA'
      revieweeName='Kofi Asante'
      revieweeContext='Your traveler from Montreal → Douala'
      onBack={() => router.back()}
      onSubmit={(review) => {
        // TODO: brancher features/reviews/api/reviews.api.ts → POST /reviews
        router.replace('/(tabs)/')
      }}
    />
  )
}
