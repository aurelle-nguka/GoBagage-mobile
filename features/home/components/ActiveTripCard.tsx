import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

type TripCardStatus = 'Open' | 'Confirmed' | 'OPEN' | 'BOOKED'

interface ActiveTripCardProps {
  from: string
  to: string
  date: string
  availableKg: number
  status: TripCardStatus
  pendingRequests: number
  onPress: () => void
}

export function ActiveTripCard({
  from,
  to,
  date,
  availableKg,
  status,
  pendingRequests,
  onPress,
}: ActiveTripCardProps) {
  const isConfirmed = status === 'Confirmed' || status === 'BOOKED'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <RouteLabel from={from} to={to} size='md' />
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isConfirmed ? '#e8faf0' : '#f3f4f6' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isConfirmed ? Colors.primary : Colors.mutedForeground },
            ]}
          >
            {isConfirmed ? 'Confirmed' : 'Open'}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📅 {date}</Text>
        <Text style={styles.metaText}>⚖️ {availableKg} kg available</Text>
        {pendingRequests > 0 && (
          <Text style={styles.requestsText}>📩 {pendingRequests} requests</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  statusBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  statusText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  requestsText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    fontWeight: FontWeight.semibold,
  },
})
