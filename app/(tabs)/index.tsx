/**
 * Go Bagage — Page Home (Tab principal)
 */

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
      onSearch={(query) =>
        router.push({
          pathname: '/(tabs)/search',
          params: query ? { q: query } : {},
        })
      }
      onTripPress={(tripId) => router.push(`/(modals)/trip-requests/${tripId}`)}
      onParcelTracking={(parcelId) =>
        router.push(`/(modals)/tracking/${parcelId}`)
      }
      onNotifications={() => {
        // TODO: écran de notifications (hors périmètre MVP immédiat)
      }}
    />
  )
}
