import { useState, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PlusCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { TripFilter, TripStatusFilter } from '../components/TripStatusFilter'
import { MyTripCard } from '../components/MyTripCard'
import type { TripStatus } from '../types/trip.types'
import apiClient from '../../../shared/services/api.client'
import { useFocusEffect } from 'expo-router'

interface MyTripListItem {
  id: string
  from: string
  to: string
  departureDate: string
  availableKg: number
  status: TripStatus
  pendingRequestsCount: number
}

interface MyTripsScreenProps {
  onPublish: () => void
  onOpenTrip: (tripId: string) => void
  onEditTrip: (tripId: string) => void
}

export function MyTripsScreen({
  onPublish,
  onOpenTrip,
  onEditTrip,
}: MyTripsScreenProps) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<TripFilter>('ALL')
  const [trips, setTrips] = useState<MyTripListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadTrips = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      setError('')

      try {
        const response = await apiClient.get('/trips/mine')
        const raw = Array.isArray(response.data)
          ? response.data
          : (response.data?.content ?? [])

        const mapped: MyTripListItem[] = raw.map((trip: any) => ({
          id: String(trip.id),
          from: trip.corridor?.departureCity ?? 'Unknown',
          to: trip.corridor?.arrivalCity ?? 'Unknown',
          departureDate: trip.departureDate ?? '',
          availableKg: trip.availableKg ?? 0,
          status: trip.status ?? 'OPEN',
          pendingRequestsCount: trip.pendingRequestsCount ?? 0,
        }))

        setTrips(mapped)
      } catch (err: any) {
        setError(err?.response?.data?.message ?? t('common.error'))
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [t],
  )

  useFocusEffect(
    useCallback(() => {
      loadTrips()
    }, [loadTrips]),
  )

  const filteredTrips = useMemo(() => {
    if (filter === 'ALL') return trips
    return trips.filter((trip) => trip.status === filter)
  }, [filter, trips])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.my_trips')}</Text>
        <Text style={styles.subtitle}>
          {t('trip.manage_subtitle', 'Manage your published trips & requests')}
        </Text>
      </View>

      <View style={styles.filterRow}>
        <TripStatusFilter selected={filter} onSelect={setFilter} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <PrimaryButton
            label={t('common.retry')}
            onPress={() => loadTrips()}
            style={{ marginTop: Spacing[4] }}
          />
        </View>
      ) : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadTrips(true)}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <MyTripCard
              from={item.from}
              to={item.to}
              departureDate={item.departureDate}
              availableKg={item.availableKg}
              status={item.status}
              pendingRequestsCount={item.pendingRequestsCount}
              onPress={() => onOpenTrip(item.id)}
              onEdit={() => onEditTrip(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <PlusCircle size={48} color='#d1d5db' />
              <Text style={styles.emptyText}>
                {filter === 'ALL'
                  ? t('trip.no_trips_published', 'No trips published yet')
                  : t('trip.no_trips_filter', 'No trips with this filter')}
              </Text>
              {filter === 'ALL' && (
                <PrimaryButton
                  label={t('home.publish_trip')}
                  onPress={onPublish}
                  style={styles.emptyButton}
                />
              )}
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
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  subtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  filterRow: { paddingHorizontal: Spacing[5], marginBottom: Spacing[4] },
  listContent: { paddingHorizontal: Spacing[5], paddingBottom: Spacing[6] },
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
    paddingHorizontal: Spacing[8],
  },
  emptyState: { alignItems: 'center', paddingVertical: Spacing[12] },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    marginTop: Spacing[3],
    marginBottom: Spacing[4],
  },
  emptyButton: { paddingHorizontal: Spacing[6] },
})
