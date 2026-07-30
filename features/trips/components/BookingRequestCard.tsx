import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import {
  CheckCircle,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Plane,
  PackageCheck,
  Ban,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { BookingStatus } from '../../bookings/types/booking.type'
import { formatCAD } from '../../../shared/utils/currency.utils'

interface BookingRequestCardProps {
  senderInitials: string
  senderName: string
  senderRating: number
  senderVerified: boolean
  parcelDescription: string
  weightKg: number
  amount: number
  status: BookingStatus
  onAccept?: () => void
  onReject?: () => void
  onPress: () => void
}

const STATUS_CONFIG: Partial<
  Record<BookingStatus, { key: string; fallback: string; Icon: any }>
> = {
  PENDING: { key: 'booking.status.pending', fallback: 'Pending payment', Icon: Clock },
  AWAITING_ACCEPTANCE: {
    key: 'booking.status.awaiting_acceptance',
    fallback: 'Awaiting your response',
    Icon: Clock,
  },
  ACCEPTED: { key: 'booking.status.accepted', fallback: 'Accepted', Icon: CheckCircle2 },
  REJECTED: { key: 'booking.status.rejected', fallback: 'Declined', Icon: XCircle },
  PICKED_UP: { key: 'booking.status.picked_up', fallback: 'Picked up', Icon: Package },
  IN_TRANSIT: { key: 'booking.status.in_transit', fallback: 'In transit', Icon: Plane },
  DELIVERED: {
    key: 'booking.status.delivered',
    fallback: 'Delivered',
    Icon: PackageCheck,
  },
  CONFIRMED: { key: 'booking.status.confirmed', fallback: 'Confirmed', Icon: CheckCircle2 },
  CANCELLED: { key: 'booking.status.cancelled', fallback: 'Cancelled', Icon: Ban },
}

const STATUS_COLORS: Partial<Record<BookingStatus, string>> = {
  PENDING: Colors.mutedForeground,
  AWAITING_ACCEPTANCE: Colors.warning,
  ACCEPTED: Colors.primary,
  REJECTED: Colors.destructive,
  PICKED_UP: Colors.primary,
  IN_TRANSIT: Colors.secondary,
  DELIVERED: Colors.primary,
  CONFIRMED: Colors.primary,
  CANCELLED: Colors.destructive,
}

export function BookingRequestCard({
  senderInitials,
  senderName,
  senderRating,
  senderVerified,
  parcelDescription,
  weightKg,
  amount,
  status,
  onAccept,
  onReject,
  onPress,
}: BookingRequestCardProps) {
  const { t } = useTranslation()
  const showActions = status === 'AWAITING_ACCEPTANCE' && (onAccept || onReject)
  const statusConfig = STATUS_CONFIG[status]

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{senderInitials}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{senderName}</Text>
            {senderVerified && <CheckCircle size={12} color={Colors.primary} />}
          </View>
          <View style={styles.ratingRow}>
            <Star size={11} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.ratingText}>
              {senderRating > 0 ? senderRating.toFixed(1) : t('trip.new', 'New')}
            </Text>
          </View>
        </View>

        {amount > 0 && <Text style={styles.amount}>{formatCAD(amount)}</Text>}
      </View>

      <View style={styles.parcelRow}>
        <Package size={13} color={Colors.mutedForeground} />
        <Text style={styles.parcelText}>
          {parcelDescription} · {weightKg} kg
        </Text>
      </View>

      {showActions ? (
        <View style={styles.actionsRow}>
          {onReject && (
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={onReject}
              activeOpacity={0.85}
            >
              <Text style={styles.rejectLabel}>{t('booking.decline', 'Decline')}</Text>
            </TouchableOpacity>
          )}
          {onAccept && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={onAccept}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptLabel}>{t('booking.accept', 'Accept')}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.statusRow}>
          {statusConfig && (
            <statusConfig.Icon
              size={12}
              color={STATUS_COLORS[status] ?? Colors.mutedForeground}
            />
          )}
          <Text
            style={[
              styles.statusLabel,
              { color: STATUS_COLORS[status] ?? Colors.mutedForeground },
            ]}
          >
            {statusConfig ? t(statusConfig.key, statusConfig.fallback) : status}
          </Text>
        </View>
      )}
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
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  info: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  amount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  parcelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing[3],
  },
  parcelText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  rejectButton: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#fecaca',
    alignItems: 'center',
  },
  rejectLabel: {
    color: Colors.destructive,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  acceptLabel: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
})
