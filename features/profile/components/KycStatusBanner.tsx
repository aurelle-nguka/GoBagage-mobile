import { useMemo } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { CheckCircle, Clock, XCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { KycStatus } from '../../../types/user.types'

interface KycStatusBannerProps {
  status: KycStatus
  rejectionReason?: string
  onGoToKyc?: () => void
}

export function KycStatusBanner({
  status,
  rejectionReason,
  onGoToKyc,
}: KycStatusBannerProps) {
  const { t } = useTranslation()

  const config = useMemo(() => {
    switch (status) {
      case 'VERIFIED':
        return {
          bg: '#e8faf0',
          border: '#c8f5df',
          badgeBg: Colors.primary,
          label: t('profile.kyc_status.verified_label', { defaultValue: 'Identity Verified ✅' }),
          sublabel: t('profile.kyc_status.verified_sublabel', { defaultValue: 'Your identity has been confirmed.' }),
          badge: t('kyc.statuses.verified', { defaultValue: 'VERIFIED' }),
          actionLabel: undefined,
        }
      case 'PENDING':
        return {
          bg: '#fff8e8',
          border: '#ffe0b2',
          badgeBg: Colors.warning,
          label: t('profile.kyc_status.pending_label', { defaultValue: 'Verification Required' }),
          sublabel: t('profile.kyc_status.pending_sublabel', { defaultValue: 'Submit your ID to unlock all features.' }),
          badge: t('kyc.statuses.pending', { defaultValue: 'PENDING' }),
          actionLabel: t('profile.kyc_status.pending_action', { defaultValue: 'Verify now' }),
        }
      case 'UNDER_REVIEW':
        return {
          bg: '#e8f4fd',
          border: '#bbdefb',
          badgeBg: Colors.secondary,
          label: t('profile.kyc_status.under_review_label', { defaultValue: 'Under Review' }),
          sublabel: t('profile.kyc_status.under_review_sublabel', { defaultValue: 'Documents submitted — usually 1–24h.' }),
          badge: t('kyc.statuses.under_review', { defaultValue: 'UNDER REVIEW' }),
          actionLabel: undefined,
        }
      case 'REJECTED':
      default:
        return {
          bg: '#fef2f2',
          border: '#fecaca',
          badgeBg: Colors.destructive,
          label: t('profile.kyc_status.rejected_label', { defaultValue: 'Verification Failed' }),
          sublabel: t('profile.kyc_status.rejected_sublabel', { defaultValue: 'Documents rejected. Please resubmit.' }),
          badge: t('kyc.statuses.rejected', { defaultValue: 'REJECTED' }),
          actionLabel: t('profile.kyc_status.rejected_action', { defaultValue: 'Resubmit' }),
        }
    }
  }, [status, t])

  const Icon =
    status === 'VERIFIED'
      ? CheckCircle
      : status === 'REJECTED'
        ? XCircle
        : Clock

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}
    >
      <Icon size={22} color={config.badgeBg} />
      <View style={styles.textBlock}>
        <Text style={styles.label}>{config.label}</Text>
        <Text style={styles.sublabel}>{config.sublabel}</Text>
        {status === 'REJECTED' && rejectionReason && (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonLabel}>
              {t('profile.kyc_status.reason_label', { defaultValue: 'Reason :' })}
            </Text>
            <Text style={styles.reasonText}>{rejectionReason}</Text>
          </View>
        )}
        {config.actionLabel && onGoToKyc && (
          <TouchableOpacity
            onPress={onGoToKyc}
            style={styles.actionButton}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>{config.actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
        <Text style={styles.badgeText}>{config.badge}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    borderWidth: 1,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  textBlock: { flex: 1 },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  sublabel: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  reasonBox: {
    marginTop: Spacing[2],
    backgroundColor: '#fecaca',
    borderRadius: Radius.md,
    padding: Spacing[3],
  },
  reasonLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.destructive,
    marginBottom: 2,
  },
  reasonText: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    lineHeight: FontSize.sm * 1.5,
  },
  actionButton: {
    marginTop: Spacing[2],
  },
  actionText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
})
