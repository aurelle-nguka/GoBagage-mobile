/**
 * Go Bagage — MyTripsScreen
 * Liste des trajets publiés par le voyageur connecté (CDC section 6.2 — "Tableau de bord voyageur").
 * Écran absent de la maquette web — construit directement à partir du CDC et du design system existant.
 */

import { useState, useMemo } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PlusCircle } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'

import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import type { TripStatus } from '../types/trip.types'
import { TripFilter, TripStatusFilter } from '../components/TripStatusFilter'
import { MyTripCard } from '../components/MyTripCard'

// TODO: remplacer par features/trips/hooks/useMyTrips() → GET /trips/mine
interface MyTripListItem {
  id: string
  from: string
  to: string
  departureDate: string
  availableKg: number
  status: TripStatus
  pendingRequestsCount: number
}

const MOCK_MY_TRIPS: MyTripListItem[] = [
  {
    id: '1',
    from: 'Montreal',
    to: 'Douala',
    departureDate: 'Jun 18, 2026',
    availableKg: 15,
    status: 'BOOKED',
    pendingRequestsCount: 3,
  },
  {
    id: '2',
    from: 'Toronto',
    to: 'Paris',
    departureDate: 'Jun 25, 2026',
    availableKg: 20,
    status: 'OPEN',
    pendingRequestsCount: 0,
  },
  {
    id: '3',
    from: 'Montreal',
    to: 'Abidjan',
    departureDate: 'May 10, 2026',
    availableKg: 18,
    status: 'COMPLETED',
    pendingRequestsCount: 0,
  },
]

interface MyTripsScreenProps {
  onPublish: () => void
  onOpenTrip: (tripId: string) => void
}

export function MyTripsScreen({ onPublish, onOpenTrip }: MyTripsScreenProps) {
  const [filter, setFilter] = useState<TripFilter>('ALL')

  const filteredTrips = useMemo(() => {
    if (filter === 'ALL') return MOCK_MY_TRIPS
    return MOCK_MY_TRIPS.filter((trip) => trip.status === filter)
  }, [filter])

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.subtitle}>
          Manage your published trips & requests
        </Text>
      </View>

      <View style={styles.filterRow}>
        <TripStatusFilter selected={filter} onSelect={setFilter} />
      </View>

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MyTripCard
            from={item.from}
            to={item.to}
            departureDate={item.departureDate}
            availableKg={item.availableKg}
            status={item.status}
            pendingRequestsCount={item.pendingRequestsCount}
            onPress={() => onOpenTrip(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <PlusCircle size={48} color='#d1d5db' />
            <Text style={styles.emptyText}>No trips in this category</Text>
            <PrimaryButton
              label='Publish a Trip'
              onPress={onPublish}
              style={styles.emptyButton}
            />
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  filterRow: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[6],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
    marginTop: Spacing[3],
    marginBottom: Spacing[4],
  },
  emptyButton: {
    paddingHorizontal: Spacing[6],
  },
})
