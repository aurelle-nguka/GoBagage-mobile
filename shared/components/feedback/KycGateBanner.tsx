/**
 * Go Bagage — KycGateBanner
 * Bannière affichée sur les écrans qui nécessitent un KYC vérifié (CDC section 3.3).
 * Bloque visuellement l'action et explique pourquoi.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { KycStatus } from '../../../types/user.types'

interface KycGateBannerProps {
  kycStatus: KycStatus
  onGoToKyc: () => void
}

const CONFIG: Record<
  KycStatus,
  {
    bg: string
    border: string
    icon: string
    title: string
    subtitle: string
    showButton: boolean
  }
> = {
  PENDING: {
    bg: '#fff8e8',
    border: '#ffe0b2',
    icon: '⚠️',
    title: 'Identity verification required',
    subtitle:
      'You must verify your identity before performing any transaction.',
    showButton: true,
  },
  UNDER_REVIEW: {
    bg: '#e8f4fd',
    border: '#bbdefb',
    icon: '⏳',
    title: 'Verification in progress',
    subtitle:
      'Your documents are being reviewed. This usually takes 1–24 hours.',
    showButton: false,
  },
  REJECTED: {
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '❌',
    title: 'Verification failed',
    subtitle: 'Your documents were rejected. Please resubmit clear photos.',
    showButton: true,
  },
  VERIFIED: {
    bg: '#e8faf0',
    border: '#c8f5df',
    icon: '✅',
    title: 'Verified',
    subtitle: '',
    showButton: false,
  },
}

export function KycGateBanner({ kycStatus, onGoToKyc }: KycGateBannerProps) {
  if (kycStatus === 'VERIFIED') return null

  const config = CONFIG[kycStatus]

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
        {config.showButton && (
          <TouchableOpacity
            style={styles.button}
            onPress={onGoToKyc}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Verify my identity →</Text>
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
  icon: { fontSize: 22, marginTop: 2 },
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
