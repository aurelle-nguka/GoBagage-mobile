import { useEffect, useState } from 'react'
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SearchHeader } from '../components/SearchHeader'
import { TravelerCard } from '../components/TravelerCard'
import type { PublicUser } from '../../../types/user.types'
import { Colors, FontSize, Spacing } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'
import apiClient from '../../../shared/services/api.client'

interface TravelerResult {
  id: string
  user: PublicUser
  initials: string
  from: string
  to: string
  departureDate: string
  availableKg: number
  pricePerKg: number
  totalTrips: number
}

interface ResultsScreenProps {
  corridorId: string
  from: string
  to: string
  onBack: () => void
  onClearSearch: () => void
  onSelectTraveler: (result: TravelerResult) => void
}

export function ResultsScreen({
  corridorId,
  from,
  to,
  onBack,
  onClearSearch,
  onSelectTraveler,
}: ResultsScreenProps) {
  const [results, setResults] = useState<TravelerResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await apiClient.get('/trips', {
          params: {
            corridorId,
            status: 'OPEN',
            page: 0,
            size: 20,
          },
        })

        const trips = response.data?.content ?? response.data ?? []

        const mapped: TravelerResult[] = trips.map((trip: any) => {
          const traveler = trip.traveler
          const corridor = trip.corridor

          return {
            id: String(trip.id),
            user: {
              id: String(traveler?.id ?? trip.travelerId),
              firstName: traveler?.firstName ?? 'Traveler',
              lastName: traveler?.lastNameInitial ?? '',
              averageRating: traveler?.averageRating ?? 0,
              totalDeliveries: traveler?.totalDeliveries ?? 0,
              kycStatus: traveler?.kycVerified ? 'VERIFIED' : 'PENDING',
            },
            initials: traveler
              ? `${(traveler.firstName ?? 'T')[0]}${(traveler.lastNameInitial ?? '')[0] ?? ''}`.toUpperCase()
              : 'T',
            from: corridor?.departureCity ?? from,
            to: corridor?.arrivalCity ?? to,
            departureDate: trip.departureDate ?? '',
            availableKg: trip.availableKg ?? 0,
            pricePerKg: trip.pricePerKg ?? trip.fixedPrice ?? 0,
            totalTrips: traveler?.totalDeliveries ?? 0,
          }
        })

        setResults(mapped)
      } catch (err: any) {
        setError(err?.response?.data?.message ?? 'Failed to load trips.')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [corridorId])

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchHeader
        title='Available Travelers'
        subtitle='Select a traveler for your parcel'
        onBack={onBack}
      />

      <View style={styles.corridorBanner}>
        <RouteLabel from={from} to={to} size='md' />
        <Text style={styles.changeText} onPress={onClearSearch}>
          Change
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size='large' color={Colors.primary} />
          <Text style={styles.loadingText}>Searching travelers...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {results.length} traveler{results.length !== 1 ? 's' : ''} found
            </Text>
          }
          renderItem={({ item }) => (
            <TravelerCard
              traveler={item.user}
              initials={item.initials}
              from={item.from}
              to={item.to}
              departureDate={item.departureDate}
              availableKg={item.availableKg}
              pricePerKg={item.pricePerKg}
              totalTrips={item.totalTrips}
              onPress={() => onSelectTraveler(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyEmoji}>✈️</Text>
              <Text style={styles.emptyTitle}>No travelers found</Text>
              <Text style={styles.emptySubtitle}>
                No trips available on this corridor yet.{'\n'}
                Try another corridor or check back later.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  corridorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  changeText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
  },
  resultCount: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginBottom: Spacing[4],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
  },
  loadingText: {
    marginTop: Spacing[3],
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    textAlign: 'center',
    paddingHorizontal: Spacing[8],
  },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing[3] },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.foreground,
  },
  emptySubtitle: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginTop: Spacing[2],
    lineHeight: FontSize.base * 1.5,
  },
})
