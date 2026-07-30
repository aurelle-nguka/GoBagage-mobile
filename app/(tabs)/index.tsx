import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/auth.store'
import { HomeScreen } from '../../features/home/screens/HomeScreen'

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuthStore()

  const role =
    user?.roles.includes('TRAVELER') && user?.roles.includes('SENDER')
      ? 'BOTH'
      : user?.roles.includes('TRAVELER')
        ? 'TRAVELER'
        : 'SENDER'

  return (
    <HomeScreen
      role={role}
      firstName={user?.firstName ?? 'there'}
      onPublish={() => router.push('/(tabs)/publish')}
      onSearch={() => router.push('/(tabs)/search')}
      onTripPress={(tripId) => router.push(`/(modals)/trip-requests/${tripId}`)}
      onParcelTracking={(bookingId) =>
        router.push(`/(modals)/tracking/${bookingId}`)
      }
      onSeeAllTrips={() => router.push('/(tabs)/trips')}
      onSeeAllActivity={() => router.push('/(modals)/activity')}
      onNotifications={() => {}}
    />
  )
}
