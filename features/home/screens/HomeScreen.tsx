import { useState, useCallback } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { Colors, Spacing } from '../../../theme'
import { HomeHeader } from '../components/HomeHeader'
import { TravelerDashboard } from '../components/TravelerDashboard'
import {
  SenderDashboard,
  SearchNavigationParams,
} from '../components/SenderDashboard'
import { notificationService } from '../../../shared/services/notification.service'

type DashboardView = 'sender' | 'traveler'
type UserRole = 'TRAVELER' | 'SENDER' | 'BOTH'

interface HomeScreenProps {
  role: UserRole
  firstName: string
  onPublish: () => void
  onSearch: (params?: SearchNavigationParams | string) => void
  onTripPress: (tripId: string) => void
  onParcelTracking: (parcelId: string) => void
  onNotifications: () => void
  onMessages?: () => void
  onSeeAllActivity?: () => void
}

export function HomeScreen({
  role,
  firstName,
  onPublish,
  onSearch,
  onTripPress,
  onParcelTracking,
  onNotifications,
  onMessages,
  onSeeAllActivity,
}: HomeScreenProps) {
  const defaultView: DashboardView = role === 'TRAVELER' ? 'traveler' : 'sender'
  const [view, setView] = useState<DashboardView>(defaultView)
  const [unreadCount, setUnreadCount] = useState(0)

  const activeDashboard: DashboardView =
    role === 'SENDER' ? 'sender' : role === 'TRAVELER' ? 'traveler' : view

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadCount(count)
    } catch {
      // Ignorer l'erreur sur le dashboard
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount()
    }, [loadUnreadCount]),
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeHeader
        firstName={firstName}
        unreadNotifications={unreadCount}
        showToggle={role === 'BOTH'}
        view={activeDashboard}
        onChangeView={setView}
        onPressNotifications={onNotifications}
        onPressMessages={onMessages}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeDashboard === 'sender' ? (
          <SenderDashboard
            onSearch={onSearch}
            onTracking={onParcelTracking}
            onSeeAll={onSeeAllActivity}
          />
        ) : (
          <TravelerDashboard
            onPublish={onPublish}
            onTracking={onTripPress}
            onSeeAll={onSeeAllActivity}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
  },
})
