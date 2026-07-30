import { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { Search, Package } from 'lucide-react-native'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { RecentParcelCard } from './RecentParcelCard'
import { PopularRouteChip } from './PopularRouterChip'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import apiClient from '../../../shared/services/api.client'
import { useCorridors } from '../../../features/corridors/hooks/useCorridors'

type ParcelStatus = 'In Transit' | 'Pending' | 'Delivered' | 'Confirmed'

interface RecentParcelItem {
  id: string
  from: string
  to: string
  travelerName: string
  date: string
  weight: string
  status: ParcelStatus
}

function mapStatus(status: string): ParcelStatus {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'AWAITING_ACCEPTANCE':
      return 'Pending'
    case 'ACCEPTED':
      return 'Pending'
    case 'PICKED_UP':
      return 'In Transit'
    case 'IN_TRANSIT':
      return 'In Transit'
    case 'DELIVERED':
      return 'In Transit'
    case 'CONFIRMED':
      return 'Confirmed'
    default:
      return 'Pending'
  }
}

interface SenderDashboardProps {
  onSearch: (query?: string) => void
  onTracking: (bookingId: string) => void
  onSeeAllActivity: () => void
  refreshing?: boolean
}

export function SenderDashboard({
  onSearch,
  onTracking,
  onSeeAllActivity,
  refreshing = false,
}: SenderDashboardProps) {
  const { t } = useTranslation()
  const [parcels, setParcels] = useState<RecentParcelItem[]>([])
  const [loading, setLoading] = useState(true)
  const { corridors } = useCorridors()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/bookings')
      const raw = Array.isArray(response.data)
        ? response.data
        : (response.data?.content ?? [])

      const mapped: RecentParcelItem[] = raw.slice(0, 5).map((b: any) => {
        const traveler = b.traveler ?? b.trip?.traveler
        const corridor = b.trip?.corridor
        return {
          id: String(b.id),
          from: corridor?.departureCity ?? 'Unknown',
          to: corridor?.arrivalCity ?? 'Unknown',
          travelerName: traveler
            ? `${traveler.firstName} ${traveler.lastNameInitial}.`
            : `Traveler #${b.travelerId}`,
          date: b.trip?.departureDate ?? '',
          weight: b.requestedKg ? `${b.requestedKg} kg` : '—',
          status: mapStatus(b.status),
        }
      })

      setParcels(mapped)
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
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>{t('home.find_corridor')}</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={16} color='#9ca3af' />
            <Text style={styles.searchInput} onPress={() => onSearch()}>
              {t('search.placeholder')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => onSearch()}
            activeOpacity={0.85}
          >
            <Text style={styles.searchButtonText}>{t('common.search')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.popularSection}>
          <Text style={styles.popularLabel}>{t('home.popular_routes')}</Text>
          <View style={styles.popularChips}>
            {corridors.slice(0, 4).map((corridor) => (
              <PopularRouteChip
                key={corridor.id}
                from={corridor.departureCity}
                to={corridor.arrivalCity}
                onPress={() => onSearch()}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('home.recent_parcels')}</Text>
        <TouchableOpacity onPress={onSeeAllActivity}>
          <Text style={styles.seeAll}>{t('home.see_all')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size='small'
          color={Colors.primary}
          style={{ marginTop: Spacing[4] }}
        />
      ) : parcels.length > 0 ? (
        parcels.map((parcel) => (
          <RecentParcelCard
            key={parcel.id}
            from={parcel.from}
            to={parcel.to}
            travelerName={parcel.travelerName}
            date={parcel.date}
            weight={parcel.weight}
            status={parcel.status}
            onPress={() => onTracking(parcel.id)}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Package size={48} color='#d1d5db' />
          <Text style={styles.emptyText}>{t('home.no_parcels')}</Text>
          <PrimaryButton
            label={t('home.send_first')}
            onPress={() => onSearch()}
            style={styles.emptyButton}
          />
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    marginBottom: Spacing[5],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
  },
  searchRow: { flexDirection: 'row', gap: Spacing[2] },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.xl,
    paddingVertical: Spacing[3],
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: '#9ca3af' },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.xl,
    justifyContent: 'center',
    paddingVertical: Spacing[3],
  },
  searchButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  popularSection: { marginTop: Spacing[3] },
  popularLabel: { fontSize: 11, color: '#9ca3af', marginBottom: Spacing[2] },
  popularChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
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
  emptyState: { alignItems: 'center', paddingVertical: Spacing[12] },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    marginTop: Spacing[3],
  },
  emptyButton: { marginTop: Spacing[4], paddingHorizontal: Spacing[6] },
})
