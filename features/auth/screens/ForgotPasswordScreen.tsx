import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { ArrowLeft, MailCheck } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { useForgotPassword } from '../hooks/useForgotPassword'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { TextField } from '../../../shared/components/ui/TextField'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'

interface ForgotPasswordScreenProps {
  onBack: () => void
  onDone: () => void
}

export function ForgotPasswordScreen({
  onBack,
  onDone,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)

  const { loading, error, submit } = useForgotPassword()

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email address is required.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      return false
    }
    setEmailError('')
    return true
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const success = await submit(email.trim().toLowerCase())
    if (success) setSent(true)
  }

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.iconCircle}>
            <MailCheck size={40} color={Colors.primary} />
          </View>
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successDesc}>
            If an account exists for <Text style={styles.bold}>{email}</Text>,
            we've sent a password reset link. It may take a few minutes to
            arrive.
          </Text>
          <PrimaryButton
            label='Back to Login'
            onPress={onDone}
            style={styles.successButton}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          Enter the email address associated with your account and we'll send
          you a reset link.
        </Text>

        <View style={styles.form}>
          <TextField
            label='Email address'
            value={email}
            onChangeText={(v) => {
              setEmail(v)
              if (emailError) setEmailError('')
            }}
            placeholder='you@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            error={emailError}
          />

          {error ? <ErrorBanner message={error} /> : null}

          <PrimaryButton
            label='Send Reset Link'
            loadingLabel='Sending...'
            loading={loading}
            onPress={handleSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4] },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingTop: Spacing[6] },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  subtitle: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.5,
    marginBottom: Spacing[6],
  },
  form: { gap: Spacing[4] },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  successTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  successDesc: {
    color: Colors.mutedForeground,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
    marginBottom: Spacing[8],
  },
  bold: { fontWeight: FontWeight.bold, color: Colors.foreground },
  successButton: { width: '100%' },
})
