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
import { useCorridors } from '../../../features/corridors/hooks/useCorridors'
import apiClient from '../../../shared/services/api.client'

const DEFAULT_POPULAR_ROUTES = [
  { id: '1', from: 'Montreal', to: 'Douala' },
  { id: '2', from: 'Toronto', to: 'Abidjan' },
  { id: '3', from: 'Paris', to: 'Lagos' },
  { id: '4', from: 'Montreal', to: 'Paris' },
]

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
    case 'AWAITING_ACCEPTANCE':
    case 'ACCEPTED':
      return 'Pending'
    case 'PICKED_UP':
    case 'IN_TRANSIT':
    case 'DELIVERED':
      return 'In Transit'
    case 'CONFIRMED':
      return 'Confirmed'
    default:
      return 'Pending'
  }
}

export interface SearchNavigationParams {
  corridorId?: string
  from?: string
  to?: string
  query?: string
}

interface SenderDashboardProps {
  onSearch: (params?: SearchNavigationParams | string) => void
  onTracking: (bookingId: string) => void
  onSeeAll?: () => void
}

export function SenderDashboard({
  onSearch,
  onTracking,
  onSeeAll,
}: SenderDashboardProps) {
  const { t } = useTranslation()
  const { corridors, loading: loadingCorridors } = useCorridors()
  const [searchQuery, setSearchQuery] = useState('')
  const [parcels, setParcels] = useState<RecentParcelItem[]>([])
  const [loading, setLoading] = useState(true)

  const displayedRoutes =
    corridors && corridors.length > 0
      ? corridors.slice(0, 6).map((c) => ({
          id: String(c.id),
          from: c.departureCity,
          to: c.arrivalCity,
        }))
      : DEFAULT_POPULAR_ROUTES

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
      // silencieux sur le dashboard
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const handleSelectRoute = (route: { id?: string; from: string; to: string }) => {
    onSearch({
      corridorId: route.id,
      from: route.from,
      to: route.to,
    })
  }

  return (
    <>
      {/* Recherche */}
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>
          {t('home.find_corridor', 'Trouver un corridor')}
        </Text>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={16} color='#9ca3af' />
            <Text
              style={styles.searchInput}
              onPress={() => onSearch(searchQuery ? { query: searchQuery } : undefined)}
            >
              {searchQuery || 'Montreal - Douala'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => onSearch(searchQuery ? { query: searchQuery } : undefined)}
            activeOpacity={0.85}
          >
            <Text style={styles.searchButtonText}>
              {t('common.search', 'Rechercher')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.popularSection}>
          <Text style={styles.popularLabel}>
            {t('home.popular_routes', 'Routes populaires')}
          </Text>
          <View style={styles.popularChips}>
            {displayedRoutes.map((route, i) => (
              <PopularRouteChip
                key={route.id || i}
                from={route.from}
                to={route.to}
                onPress={() => handleSelectRoute(route)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Colis récents */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('home.recent_parcels', 'Colis Récents')}
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
          <Text style={styles.emptyText}>
            {t('home.no_parcels', 'Aucun colis pour l\'instant')}
          </Text>
          <PrimaryButton
            label={t('home.send_first', 'Envoyez votre premier colis')}
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
  searchRow: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
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
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: '#9ca3af',
  },
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
  popularLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: Spacing[2],
  },
  popularChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
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
    paddingVertical: Spacing[12],
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    marginTop: Spacing[3],
  },
  emptyButton: {
    marginTop: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
})
