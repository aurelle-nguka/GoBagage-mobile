/**
 * Go Bagage — Page My Trips (Tab)
 */

import { useRouter } from 'expo-router'
import { MyTripsScreen } from '../../features/trips/screens/MyTripsScreen'

export default function TripsPage() {
  const router = useRouter()

  return (
    <MyTripsScreen
      onPublish={() => router.push('/(tabs)/publish')}
      onOpenTrip={(tripId) => router.push(`/(modals)/trip-requests/${tripId}`)}
    />
  )
}
