import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { TrendingUp } from 'lucide-react-native'
import { StatCard } from './StatCard'
import { ActiveTripCard } from './ActiveTripCard'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

// TODO: remplacer par features/trips/hooks/useMyTrips()
const MOCK_ACTIVE_TRIPS = [
  {
    id: '1',
    from: 'Montreal',
    to: 'Douala',
    date: 'Jun 18, 2026',
    kg: 15,
    status: 'Confirmed' as const,
    requests: 3,
  },
  {
    id: '2',
    from: 'Toronto',
    to: 'Paris',
    date: 'Jun 25, 2026',
    kg: 20,
    status: 'Open' as const,
    requests: 0,
  },
]

interface TravelerDashboardProps {
  onPublish: () => void
  onTracking: (tripId: string) => void
}

export function TravelerDashboard({
  onPublish,
  onTracking,
}: TravelerDashboardProps) {
  return (
    <>
      <View style={styles.statsRow}>
        <StatCard
          emoji='✈️'
          value='2'
          label='Active Trips'
          backgroundColor='#e8faf0'
        />
        <StatCard
          emoji='📩'
          value='3'
          label='Requests'
          backgroundColor='#e8f4fd'
        />
        <StatCard
          emoji='💰'
          value='320'
          suffix='CAD'
          label='Earned'
          backgroundColor='#fff8e8'
        />
      </View>

      <TouchableOpacity
        style={styles.ctaCard}
        onPress={onPublish}
        activeOpacity={0.9}
      >
        <View>
          <Text style={styles.ctaEyebrow}>Ready to earn?</Text>
          <Text style={styles.ctaTitle}>Publish a Trip</Text>
          <Text style={styles.ctaSubtitle}>Set your route, kg, and price</Text>
        </View>
        <View style={styles.ctaIconBox}>
          <TrendingUp size={26} color={Colors.white} />
        </View>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Active Trips</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {MOCK_ACTIVE_TRIPS.map((trip) => (
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
      ))}
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
})
