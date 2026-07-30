import { useRouter } from 'expo-router'
import { MyTripsScreen } from '../../features/trips/screens/MyTripsScreen'

export default function TripsPage() {
  const router = useRouter()

  return (
    <MyTripsScreen
      onPublish={() => router.push('/(tabs)/publish')}
      onOpenTrip={(tripId) => router.push(`/(modals)/trip-requests/${tripId}`)}
      onEditTrip={(tripId) =>
        router.push({
          pathname: '/(modals)/edit-trip',
          params: { tripId },
        })
      }
    />
  )
}
