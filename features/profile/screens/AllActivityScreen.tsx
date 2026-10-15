import { useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import {
  RecentActivityRow,
  type ActivityItem,
} from '../components/RecentActivityRow'
import { useAuthStore } from '../../../store/auth.store'
import apiClient from '../../../shared/services/api.client'

interface AllActivityScreenProps {
  onBack: () => void
  onOpenBooking: (bookingId: string) => void
}

export function AllActivityScreen({
  onBack,
  onOpenBooking,
}: AllActivityScreenProps) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const isTraveler = user?.roles.includes('TRAVELER') ?? false

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError('')

      try {
        const response = await apiClient.get('/bookings')
        const raw = Array.isArray(response.data)
          ? response.data
          : (response.data?.content ?? [])

        const mapped: ActivityItem[] = raw.map((b: any) => {
          const corridor = b.trip?.corridor
          const unknown = t('common.unknown', 'Unknown')
          const from = corridor?.departureCity ?? unknown
          const to = corridor?.arrivalCity ?? unknown
          const isEarning = isTraveler && (b.travelerAmountCad ?? 0) > 0

          return {
            id: String(b.id),
            type: isTraveler ? 'trip' : 'parcel',
            from,
            to,
            amount: isEarning ? b.travelerAmountCad : -(b.totalAmountCad ?? 0),
            date: b.createdAt
              ? new Intl.DateTimeFormat('en', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date(b.createdAt))
              : '—',
            status: b.status ?? 'PENDING',
          }
        })

        setActivities(mapped)
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            t('profile.activity_load_error', 'Failed to load activity.'),
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [isTraveler],
  )

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>
            {t('profile.all_activity', 'All Activity')}
          </Text>
          <Text style={styles.subtitle}>
            {t('profile.transactions_count', '{{count}} transactions', {
              count: activities.length,
            })}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <RecentActivityRow
              activity={item}
              onPress={() => onOpenBooking(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {t('profile.no_activity', 'No activity yet')}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
  },
})
