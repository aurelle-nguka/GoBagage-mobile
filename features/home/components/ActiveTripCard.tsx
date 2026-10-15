import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Calendar, Weight, Inbox } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
            {isConfirmed ? t('home.status_confirmed', 'Confirmed') : t('trip.open', 'Open')}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={13} color={Colors.mutedForeground} />
          <Text style={styles.metaText}>{date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Weight size={13} color={Colors.mutedForeground} />
          <Text style={styles.metaText}>
            {t('trip.kg_available', '{{value}} kg available', { value: availableKg })}
          </Text>
        </View>
        {pendingRequests > 0 && (
          <View style={styles.metaItem}>
            <Inbox size={13} color={Colors.warning} />
            <Text style={styles.requestsText}>
              {t('home.requests_count', '{{count}} requests', { count: pendingRequests })}
            </Text>
          </View>
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
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
