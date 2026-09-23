import { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react-native'
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

  const config = useMemo(() => {
    switch (item.status) {
      case 'PENDING':
        return {
          color: Colors.warning,
          bg: '#fff8e8',
          icon: Clock,
          label: t('kyc.statuses.pending', { defaultValue: 'Pending' }),
        }
      case 'UNDER_REVIEW':
        return {
          color: Colors.secondary,
          bg: '#e8f4fd',
          icon: Clock,
          label: t('kyc.statuses.under_review', { defaultValue: 'Under Review' }),
        }
      case 'VERIFIED':
        return {
          color: Colors.primary,
          bg: '#e8faf0',
          icon: CheckCircle,
          label: t('kyc.statuses.verified', { defaultValue: 'Verified' }),
        }
      case 'REJECTED':
      default:
        return {
          color: Colors.destructive,
          bg: '#fef2f2',
          icon: XCircle,
          label: t('kyc.statuses.rejected', { defaultValue: 'Rejected' }),
        }
    }
  }, [item.status, t])

  const Icon = config.icon
  const initials =
    `${item.userFirstName[0] ?? ''}${item.userLastName[0] ?? ''}`.toUpperCase()

  const submittedAt = new Intl.DateTimeFormat(i18n.language || 'en', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(item.submittedAt))

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
            <Text style={styles.docType}>🪪 {item.documentType}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
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
  email: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  docType: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  date: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
  },
  right: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
})
