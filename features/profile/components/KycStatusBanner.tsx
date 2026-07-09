/**
 * Go Bagage — KycStatusBanner (Profile)
 * Bandeau KYC dans le profil — cliquable pour relancer le flux KYC.
 */

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { CheckCircle, Clock, XCircle } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { KycStatus } from '../../../types/user.types'

interface KycStatusBannerProps {
  status: KycStatus
  rejectionReason?: string
  onGoToKyc?: () => void
}

const STATUS_CONFIG: Record<
  KycStatus,
  {
    bg: string
    border: string
    badgeBg: string
    label: string
    sublabel: string
    actionLabel?: string
  }
> = {
  VERIFIED: {
    bg: '#e8faf0',
    border: '#c8f5df',
    badgeBg: Colors.primary,
    label: 'Identity Verified ✅',
    sublabel: 'Your identity has been confirmed.',
  },
  PENDING: {
    bg: '#fff8e8',
    border: '#ffe0b2',
    badgeBg: Colors.warning,
    label: 'Verification Required',
    sublabel: 'Submit your ID to unlock all features.',
    actionLabel: 'Verify now →',
  },
  UNDER_REVIEW: {
    bg: '#e8f4fd',
    border: '#bbdefb',
    badgeBg: Colors.secondary,
    label: 'Under Review',
    sublabel: 'Documents submitted — usually 1–24h.',
  },
  REJECTED: {
    bg: '#fef2f2',
    border: '#fecaca',
    badgeBg: Colors.destructive,
    label: 'Verification Failed',
    sublabel: 'Documents rejected. Please resubmit.',
    actionLabel: 'Resubmit →',
  },
}

export function KycStatusBanner({
  status,
  rejectionReason,
  onGoToKyc,
}: KycStatusBannerProps) {
  const config = STATUS_CONFIG[status]
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
            <Text style={styles.reasonLabel}>Reason :</Text>
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
        <Text style={styles.badgeText}>{status.replace('_', ' ')}</Text>
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
