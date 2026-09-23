import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ChevronRight, Scale } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { Dispute, DisputeStatus } from '../types/admin.types'

interface DisputeListItemProps {
  dispute: Dispute
  onPress: () => void
}

const STATUS_COLORS: Record<DisputeStatus, { color: string; bg: string }> = {
  OPEN: { color: Colors.destructive, bg: '#fef2f2' },
  UNDER_INVESTIGATION: { color: Colors.secondary, bg: '#e8f4fd' },
  DECIDED: { color: Colors.warning, bg: '#fff8e8' },
  CLOSED: { color: Colors.primary, bg: '#e8faf0' },
}

export function DisputeListItem({ dispute, onPress }: DisputeListItemProps) {
  const { t, i18n } = useTranslation()
  const statusStyle = STATUS_COLORS[dispute.status]

  const createdAt = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dispute.createdAt))

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconBox}>
        <Scale size={20} color={Colors.destructive} />
      </View>

      <View style={styles.info}>
        <Text style={styles.reason}>
          {t(`disputes.reasons.${dispute.reason}`, dispute.reason.replace(/_/g, ' '))}
        </Text>
        <Text style={styles.meta}>
          {t('booking.title', 'Booking')} #{dispute.bookingId} · {createdAt}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {t(`admin.disputes.status_${dispute.status.toLowerCase()}`, dispute.status)}
          </Text>
        </View>
        <ChevronRight size={16} color='#d1d5db' style={{ marginTop: Spacing[2] }} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
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
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.xl,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  reason: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.foreground },
  meta: { fontSize: FontSize.sm, color: Colors.mutedForeground, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  statusBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: 10, fontWeight: FontWeight.bold },
})
