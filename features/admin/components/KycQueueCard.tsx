import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import {
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { KycQueueItem } from '../types/admin.types'
import type { KycStatus } from '../../../types/user.types'

interface KycQueueCardProps {
  item: KycQueueItem
  onPress: () => void
}

export function KycQueueCard({ item, onPress }: KycQueueCardProps) {
  const { t, i18n } = useTranslation()

  const STATUS_CONFIG: Record<
    KycStatus,
    { color: string; bg: string; Icon: any; label: string }
  > = {
    PENDING: {
      color: Colors.warning,
      bg: '#fff8e8',
      Icon: Clock,
      label: t('admin.pending'),
    },
    UNDER_REVIEW: {
      color: Colors.secondary,
      bg: '#e8f4fd',
      Icon: Clock,
      label: t('admin.under_review'),
    },
    VERIFIED: {
      color: Colors.primary,
      bg: '#e8faf0',
      Icon: CheckCircle,
      label: t('admin.verified'),
    },
    REJECTED: {
      color: Colors.destructive,
      bg: '#fef2f2',
      Icon: XCircle,
      label: t('admin.rejected'),
    },
  }

  const config = STATUS_CONFIG[item.status]
  const { Icon } = config
  const initials =
    `${item.userFirstName[0] ?? ''}${item.userLastName[0] ?? ''}`.toUpperCase()

  const submittedAt = item.submittedAt
    ? new Intl.DateTimeFormat(i18n.language, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(item.submittedAt))
    : '—'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            {item.userFirstName} {item.userLastName}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {item.userEmail}
          </Text>
          <View style={styles.metaRow}>
            <CreditCard size={12} color={Colors.mutedForeground} />
            <Text style={styles.docType}>{item.documentType ?? '—'}</Text>
            <Text style={styles.date}>· {submittedAt}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
            <Icon size={10} color={config.color} />
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
          <ChevronRight
            size={16}
            color='#d1d5db'
            style={{ marginTop: Spacing[2] }}
          />
        </View>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  info: { flex: 1 },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  email: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  docType: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  date: { fontSize: FontSize.sm, color: '#9ca3af' },
  right: { alignItems: 'flex-end' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: { fontSize: 10, fontWeight: FontWeight.bold },
})
