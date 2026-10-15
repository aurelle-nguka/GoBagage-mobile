import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Package, ArrowRight, Calendar, Weight } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

type ParcelDisplayStatus = 'In Transit' | 'Pending' | 'Delivered' | 'Confirmed'

const STATUS_CONFIG: Record<
  ParcelDisplayStatus,
  { key: string; fallback: string; bg: string; color: string }
> = {
  Pending: { key: 'admin.pending', fallback: 'Pending', bg: '#fff8e8', color: Colors.warning },
  'In Transit': {
    key: 'trip.in_transit',
    fallback: 'In Transit',
    bg: '#e8f4fd',
    color: Colors.secondary,
  },
  Delivered: {
    key: 'trip.delivered',
    fallback: 'Delivered',
    bg: '#e8faf0',
    color: Colors.primary,
  },
  Confirmed: {
    key: 'home.status_confirmed',
    fallback: 'Confirmed',
    bg: '#e8faf0',
    color: Colors.primary,
  },
}

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
  const { t } = useTranslation()
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG['Pending']

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <View style={styles.leftRow}>
          <View style={styles.iconBox}>
            <Package size={16} color={Colors.primary} />
          </View>
          <View style={styles.textBlock}>
            <RouteLabel from={from} to={to} size='sm' />
            <Text style={styles.viaText}>
              {t('parcel.via_traveler', 'via {{name}}', { name: travelerName })}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Text style={[styles.statusText, { color: config.color }]}>
            {t(config.key, config.fallback)}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={12} color={Colors.mutedForeground} />
          <Text style={styles.metaText}>{date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Weight size={12} color={Colors.mutedForeground} />
          <Text style={styles.metaText}>{weight}</Text>
        </View>
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
  textBlock: { flex: 1 },
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
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  chevron: {
    marginLeft: 'auto',
  },
})
