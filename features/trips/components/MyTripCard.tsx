import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import {
  ChevronRight,
  Calendar,
  Weight,
  Inbox,
  Edit2,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { TripStatus } from '../types/trip.types'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

const STATUS_CONFIG: Record<
  TripStatus,
  { key: string; fallback: string; bg: string; color: string }
> = {
  OPEN: { key: 'trip.open', fallback: 'Open', bg: '#f3f4f6', color: Colors.mutedForeground },
  BOOKED: { key: 'trip.booked', fallback: 'Booked', bg: '#e8faf0', color: Colors.primary },
  IN_TRANSIT: {
    key: 'trip.in_transit',
    fallback: 'In Transit',
    bg: '#e8f4fd',
    color: Colors.secondary,
  },
  DELIVERED: {
    key: 'trip.delivered',
    fallback: 'Delivered',
    bg: '#fff8e8',
    color: Colors.warning,
  },
  COMPLETED: {
    key: 'trip.completed',
    fallback: 'Completed',
    bg: '#e8faf0',
    color: Colors.primary,
  },
  CANCELLED: {
    key: 'trip.cancelled',
    fallback: 'Cancelled',
    bg: '#fef2f2',
    color: Colors.destructive,
  },
}

interface MyTripCardProps {
  from: string
  to: string
  departureDate: string
  availableKg: number
  status: TripStatus
  pendingRequestsCount: number
  onPress: () => void
  onEdit?: () => void
}

export function MyTripCard({
  from,
  to,
  departureDate,
  availableKg,
  status,
  pendingRequestsCount,
  onPress,
  onEdit,
}: MyTripCardProps) {
  const { t } = useTranslation()
  const config = STATUS_CONFIG[status]
  const canEdit = status === 'OPEN'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.headerRow}>
        <RouteLabel from={from} to={to} size='md' />
        <View style={styles.headerRight}>
          {canEdit && onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              style={styles.editButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Edit2 size={14} color={Colors.primary} />
            </TouchableOpacity>
          )}
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Text style={[styles.statusText, { color: config.color }]}>
              {t(config.key, config.fallback)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={13} color={Colors.mutedForeground} />
          <Text style={styles.metaText}>{departureDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Weight size={13} color={Colors.mutedForeground} />
          <Text style={styles.metaText}>
            {t('trip.kg_available', '{{value}} kg available', { value: availableKg })}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        {pendingRequestsCount > 0 ? (
          <View style={styles.requestsBadge}>
            <Inbox size={12} color={Colors.warning} />
            <Text style={styles.requestsText}>
              {t('trip.pending_requests', { count: pendingRequestsCount })}
            </Text>
          </View>
        ) : (
          <Text style={styles.noRequestsText}>{t('trip.no_requests', 'No requests yet')}</Text>
        )}
        <ChevronRight size={16} color='#d1d5db' />
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: Spacing[4],
    marginBottom: Spacing[3],
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  requestsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff8e8',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.md,
  },
  requestsText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    fontWeight: FontWeight.semibold,
  },
  noRequestsText: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
  },
})
