/**
 * Go Bagage — RecentParcelCard
 */

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Package, ArrowRight } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

type ParcelDisplayStatus = 'In Transit' | 'Pending'

interface RecentParcelCardProps {
  from: string
  to: string
  travelerName: string
  date: string
  weight: string
  status: ParcelDisplayStatus
  onPress: () => void
}

export function RecentParcelCard({
  from,
  to,
  travelerName,
  date,
  weight,
  status,
  onPress,
}: RecentParcelCardProps) {
  const isInTransit = status === 'In Transit'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <View style={styles.leftRow}>
          <View style={styles.iconBox}>
            <Package size={16} color={Colors.primary} />
          </View>
          <View style={styles.textBlock}>
            <RouteLabel from={from} to={to} size='sm' />
            <Text style={styles.viaText}>via {travelerName}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isInTransit ? '#e8f4fd' : '#fff8e8' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isInTransit ? Colors.secondary : Colors.warning },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📅 {date}</Text>
        <Text style={styles.metaText}>⚖️ {weight}</Text>
        <ArrowRight size={14} color='#9ca3af' style={styles.chevron} />
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
    marginBottom: Spacing[2],
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    flex: 1,
  },
  textBlock: {
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.lg,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viaText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
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
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  chevron: {
    marginLeft: 'auto',
  },
})
