/**
 * Go Bagage — OtpScreen
 * Vérification OTP par SMS. Purpose = PHONE_VERIFICATION.
 * Minuteur de renvoi 300 secondes.
 */

import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { AuthHeader } from '../components/AuthHeader'
import { AuthProgressSteps } from '../components/AuthProgressSteps'
import { OTP_LENGTH } from '../../../shared/constants/app.constants'
import { useOtpVerify } from '../hooks/useOtpVerify'
import { OtpInput } from '../components/Otpinput'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { ResendTimer } from '../components/ResendTimer'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

interface OtpScreenProps {
  role: RoleChoice
  phone: string
  onBack: () => void
  onSuccess: () => void
}

const ROLE_LABELS: Record<RoleChoice, string> = {
  TRAVELER: 'Traveler',
  SENDER: 'Sender',
  BOTH: 'Traveler & Sender',
}

export function OtpScreen({ role, phone, onBack, onSuccess }: OtpScreenProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [resendKey, setResendKey] = useState(0)

  const { loading, resending, error, verify, resend } = useOtpVerify()

  const handleVerify = async () => {
    const success = await verify(phone, otp)
    if (success) onSuccess()
  }

  const handleResend = async () => {
    await resend(phone)
    setOtp(Array(OTP_LENGTH).fill(''))
    setResendKey((k) => k + 1)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AuthHeader roleLabel={ROLE_LABELS[role]} onBack={onBack} />

      <View style={styles.content}>
        <AuthProgressSteps currentStep={1} />

        <Text style={styles.title}>Verify your phone number</Text>
        <Text style={styles.subtitle}>We sent a 6-digit code by SMS to</Text>
        <Text style={styles.phone}>{phone}</Text>

        <OtpInput value={otp} onChange={setOtp} />

        {error ? <ErrorBanner message={error} /> : null}

        <PrimaryButton
          label='Verify Code'
          loadingLabel='Verifying...'
          loading={loading}
          onPress={handleVerify}
        />

        <ResendTimer onResend={handleResend} resetKey={resendKey} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[6],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  subtitle: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    marginBottom: Spacing[1],
  },
  phone: {
    color: Colors.foreground,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing[8],
  },
})
