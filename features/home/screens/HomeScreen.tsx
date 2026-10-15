import { useState, useCallback } from 'react'
import { ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Spacing } from '../../../theme'
import { HomeHeader } from '../components/HomeHeader'
import { TravelerDashboard } from '../components/TravelerDashboard'
import { SenderDashboard } from '../components/SenderDashboard'

type DashboardView = 'sender' | 'traveler'
type UserRole = 'TRAVELER' | 'SENDER' | 'BOTH'

interface HomeScreenProps {
  role: UserRole
  firstName: string
  onPublish: () => void
  onSearch: (query?: string) => void
  onTripPress: (tripId: string) => void
  onParcelTracking: (parcelId: string) => void
  onNotifications: () => void
  onSeeAllTrips: () => void
  onSeeAllActivity: () => void
}

export function HomeScreen({
  role,
  firstName,
  onPublish,
  onSearch,
  onTripPress,
  onParcelTracking,
  onNotifications,
  onSeeAllTrips,
  onSeeAllActivity,
}: HomeScreenProps) {
  const defaultView: DashboardView = role === 'TRAVELER' ? 'traveler' : 'sender'
  const [view, setView] = useState<DashboardView>(defaultView)
  const [refreshing, setRefreshing] = useState(false)

  const activeDashboard: DashboardView =
    role === 'SENDER' ? 'sender' : role === 'TRAVELER' ? 'traveler' : view

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader
        firstName={firstName}
        unreadNotifications={0}
        showToggle={role === 'BOTH'}
        view={activeDashboard}
        onChangeView={setView}
        onPressNotifications={onNotifications}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {activeDashboard === 'sender' ? (
          <SenderDashboard
            onSearch={onSearch}
            onTracking={onParcelTracking}
            onSeeAllActivity={onSeeAllActivity}
            refreshing={refreshing}
          />
        ) : (
          <TravelerDashboard
            onPublish={onPublish}
            onTracking={onTripPress}
            onSeeAllTrips={onSeeAllTrips}
            refreshing={refreshing}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  content: { flex: 1, backgroundColor: Colors.background },
  contentContainer: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
  },
})
