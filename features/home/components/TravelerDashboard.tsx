import { useCallback, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { TrendingUp, Plane, Inbox, DollarSign } from 'lucide-react-native'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { StatCard } from './StatCard'
import { ActiveTripCard } from './ActiveTripCard'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import apiClient from '../../../shared/services/api.client'

interface TripItem {
  id: string
  from: string
  to: string
  date: string
  kg: number
  status: 'Open' | 'Confirmed'
  requests: number
}

interface TravelerDashboardProps {
  onPublish: () => void
  onTracking: (tripId: string) => void
  onSeeAllTrips: () => void
  refreshing?: boolean
}

export function TravelerDashboard({
  onPublish,
  onTracking,
  onSeeAllTrips,
  refreshing = false,
}: TravelerDashboardProps) {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<TripItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTrips, setActiveTrips] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [tripsRes, bookingsRes] = await Promise.all([
        apiClient.get('/trips/mine'),
        apiClient.get('/bookings'),
      ])

      const rawTrips = Array.isArray(tripsRes.data)
        ? tripsRes.data
        : (tripsRes.data?.content ?? [])
      const rawBookings = Array.isArray(bookingsRes.data)
        ? bookingsRes.data
        : (bookingsRes.data?.content ?? [])

      const mapped: TripItem[] = rawTrips
        .filter((t: any) => t.status === 'OPEN' || t.status === 'BOOKED')
        .slice(0, 3)
        .map((t: any) => ({
          id: String(t.id),
          from: t.corridor?.departureCity ?? 'Unknown',
          to: t.corridor?.arrivalCity ?? 'Unknown',
          date: t.departureDate ?? '',
          kg: t.availableKg ?? 0,
          status: t.status === 'BOOKED' ? 'Confirmed' : 'Open',
          requests: t.pendingRequestsCount ?? 0,
        }))

      setTrips(mapped)
      setActiveTrips(
        rawTrips.filter(
          (t: any) => t.status === 'OPEN' || t.status === 'BOOKED',
        ).length,
      )
      setTotalRequests(
        rawTrips.reduce(
          (sum: number, t: any) => sum + (t.pendingRequestsCount ?? 0),
          0,
        ),
      )

      const earned = rawBookings
        .filter((b: any) => b.status === 'CONFIRMED')
        .reduce((sum: number, b: any) => sum + (b.travelerAmountCad ?? 0), 0)
      setTotalEarned(earned)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  return (
    <>
      <View style={styles.statsRow}>
        <StatCard
          icon={<Plane size={20} color='#00C853' />}
          value={loading ? '…' : String(activeTrips)}
          label={t('home.active_trips')}
          backgroundColor='#e8faf0'
        />
        <StatCard
          icon={<Inbox size={20} color='#2196F3' />}
          value={loading ? '…' : String(totalRequests)}
          label={t('home.requests')}
          backgroundColor='#e8f4fd'
        />
        <StatCard
          icon={<DollarSign size={20} color='#FF9800' />}
          value={
            loading ? '…' : totalEarned > 0 ? `$${totalEarned.toFixed(2)}` : '—'
          }
          label={t('home.earned')}
          backgroundColor='#fff8e8'
        />
      </View>

      <TouchableOpacity
        style={styles.ctaCard}
        onPress={onPublish}
        activeOpacity={0.9}
      >
        <View>
          <Text style={styles.ctaEyebrow}>{t('home.ready_to_earn')}</Text>
          <Text style={styles.ctaTitle}>{t('home.publish_trip')}</Text>
          <Text style={styles.ctaSubtitle}>{t('home.publish_subtitle')}</Text>
        </View>
        <View style={styles.ctaIconBox}>
          <TrendingUp size={26} color={Colors.white} />
        </View>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('home.my_active_trips')}</Text>
        <TouchableOpacity onPress={onSeeAllTrips}>
          <Text style={styles.seeAll}>{t('home.see_all')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size='small'
          color={Colors.primary}
          style={{ marginTop: Spacing[4] }}
        />
      ) : trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Plane size={48} color='#d1d5db' />
          <Text style={styles.emptyText}>{t('home.no_trips')}</Text>
          <TouchableOpacity onPress={onPublish}>
            <Text style={styles.emptyAction}>{t('home.publish_first')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        trips.map((trip) => (
          <ActiveTripCard
            key={trip.id}
            from={trip.from}
            to={trip.to}
            date={trip.date}
            availableKg={trip.kg}
            status={trip.status}
            pendingRequests={trip.requests}
            onPress={() => onTracking(trip.id)}
          />
        ))
      )}
    </>
  )
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: Spacing[3], marginBottom: Spacing[5] },
  ctaCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[5],
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaEyebrow: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginBottom: 2,
  },
  ctaTitle: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  ctaSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  ctaIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius['2xl'],
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  emptyState: { alignItems: 'center', paddingVertical: Spacing[8] },
  emptyText: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    marginBottom: Spacing[2],
    marginTop: Spacing[2],
  },
  emptyAction: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
})
