/**
 * Go Bagage — KycGateBanner
 * Bannière affichée sur les écrans qui nécessitent un KYC vérifié (CDC section 3.3).
 * Bloque visuellement l'action et explique pourquoi.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ShieldAlert, Clock, XCircle, CheckCircle2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { KycStatus } from '../../../types/user.types'

interface KycGateBannerProps {
  kycStatus: KycStatus
  onGoToKyc: () => void
}

function getConfig(t: (key: string, fallback: string) => string): Record<
  KycStatus,
  {
    bg: string
    border: string
    Icon: React.ComponentType<{ size: number; color: string }>
    iconColor: string
    title: string
    subtitle: string
    showButton: boolean
  }
> {
  return {
    PENDING: {
      bg: '#fff8e8',
      border: '#ffe0b2',
      Icon: ShieldAlert,
      iconColor: Colors.warning,
      title: t(
        'common.kyc_gate.pending_title',
        'Identity verification required',
      ),
      subtitle: t(
        'common.kyc_gate.pending_subtitle',
        'You must verify your identity before performing any transaction.',
      ),
      showButton: true,
    },
    UNDER_REVIEW: {
      bg: '#e8f4fd',
      border: '#bbdefb',
      Icon: Clock,
      iconColor: Colors.secondary,
      title: t(
        'common.kyc_gate.under_review_title',
        'Verification in progress',
      ),
      subtitle: t(
        'common.kyc_gate.under_review_subtitle',
        'Your documents are being reviewed. This usually takes 1–24 hours.',
      ),
      showButton: false,
    },
    REJECTED: {
      bg: '#fef2f2',
      border: '#fecaca',
      Icon: XCircle,
      iconColor: Colors.destructive,
      title: t('common.kyc_gate.rejected_title', 'Verification failed'),
      subtitle: t(
        'common.kyc_gate.rejected_subtitle',
        'Your documents were rejected. Please resubmit clear photos.',
      ),
      showButton: true,
    },
    VERIFIED: {
      bg: '#e8faf0',
      border: '#c8f5df',
      Icon: CheckCircle2,
      iconColor: Colors.primary,
      title: t('common.kyc_gate.verified_title', 'Verified'),
      subtitle: '',
      showButton: false,
    },
  }
}

export function KycGateBanner({ kycStatus, onGoToKyc }: KycGateBannerProps) {
  const { t } = useTranslation()
  if (kycStatus === 'VERIFIED') return null

  const config = getConfig(t)[kycStatus]
  const { Icon } = config

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}
    >
      <Icon size={22} color={config.iconColor} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
        {config.showButton && (
          <TouchableOpacity
            style={styles.button}
            onPress={onGoToKyc}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              {t('common.kyc_gate.verify_cta', 'Verify my identity')}
            </Text>
          </TouchableOpacity>
        )}
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
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[4],
    marginTop: Spacing[3],
  },
  textBlock: { flex: 1 },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    lineHeight: FontSize.sm * 1.5,
  },
  button: {
    marginTop: Spacing[3],
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
})
