import { useCallback, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { TrendingUp } from 'lucide-react-native'
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
  onSeeAll?: () => void
}

export function TravelerDashboard({
  onPublish,
  onTracking,
  onSeeAll,
}: TravelerDashboardProps) {
  const { t } = useTranslation()
  const [trips, setTrips] = useState<TripItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTrips, setActiveTrips] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/trips/mine')
      const raw = Array.isArray(response.data)
        ? response.data
        : (response.data?.content ?? [])

      const mapped: TripItem[] = raw
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
        raw.filter((t: any) => t.status === 'OPEN' || t.status === 'BOOKED')
          .length,
      )
      setTotalRequests(
        raw.reduce(
          (sum: number, t: any) => sum + (t.pendingRequestsCount ?? 0),
          0,
        ),
      )
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
          emoji='✈️'
          value={loading ? '…' : String(activeTrips)}
          label={t('home.active_trips', 'Trajets Actifs')}
          backgroundColor='#e8faf0'
        />
        <StatCard
          emoji='📩'
          value={loading ? '…' : String(totalRequests)}
          label={t('home.requests', 'Demandes')}
          backgroundColor='#e8f4fd'
        />
        <StatCard
          emoji='💰'
          value='—'
          label={t('home.earned', 'Gains')}
          backgroundColor='#fff8e8'
        />
      </View>

      <TouchableOpacity
        style={styles.ctaCard}
        onPress={onPublish}
        activeOpacity={0.9}
      >
        <View>
          <Text style={styles.ctaEyebrow}>
            {t('home.ready_to_earn', 'Prêt à gagner ?')}
          </Text>
          <Text style={styles.ctaTitle}>
            {t('home.publish_trip', 'Publier un Trajet')}
          </Text>
          <Text style={styles.ctaSubtitle}>
            {t('home.publish_subtitle', 'Définissez votre route, kg et prix')}
          </Text>
        </View>
        <View style={styles.ctaIconBox}>
          <TrendingUp size={26} color={Colors.white} />
        </View>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('home.my_active_trips', 'Mes Trajets Actifs')}
        </Text>
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>
            {t('home.see_all', 'Tout voir')}
          </Text>
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
          <Text style={styles.emptyEmoji}>✈️</Text>
          <Text style={styles.emptyText}>
            {t('home.no_trips', 'Aucun trajet actif')}
          </Text>
          <TouchableOpacity onPress={onPublish}>
            <Text style={styles.emptyAction}>
              {t('home.publish_first', 'Publiez votre premier trajet')}
            </Text>
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
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
  ctaSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[8],
  },
  emptyEmoji: { fontSize: 36, marginBottom: Spacing[2] },
  emptyText: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    marginBottom: Spacing[2],
  },
  emptyAction: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
})
