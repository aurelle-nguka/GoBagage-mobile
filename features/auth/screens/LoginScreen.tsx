import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { Plane } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { useLogin } from '../hooks/useLogin'
import { TextField } from '../../../shared/components/ui/TextField'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

interface LoginScreenProps {
  role?: RoleChoice
  onLoginSuccess: (isAdmin: boolean) => void
  onForgotPassword: () => void
  onCreateAccount: () => void
}

interface FieldErrors {
  email?: string
  password?: string
}

export function LoginScreen({
  onLoginSuccess,
  onForgotPassword,
  onCreateAccount,
}: LoginScreenProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { loading, error, submit } = useLogin()

  const validate = (): boolean => {
    const errors: FieldErrors = {}

    if (!email.trim()) errors.email = t('auth.errors.email_required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = t('auth.errors.email_invalid')

    if (!password) errors.password = t('auth.errors.password_required')
    else if (password.length < 8)
      errors.password = t('auth.errors.password_min')

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    const result = await submit({
      email: email.trim().toLowerCase(),
      password,
    })
    if (result) onLoginSuccess(result === 'ADMIN')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            <Plane size={36} color={Colors.primary} />
          </View>
          <Text style={styles.title}>
            {t('auth.welcome_back', 'Welcome back')}
          </Text>
          <Text style={styles.subtitle}>
            {t('auth.login_subtitle', 'Log in to continue to Go Bagage')}
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            label={t('auth.email')}
            value={email}
            onChangeText={(v) => {
              setEmail(v)
              if (fieldErrors.email)
                setFieldErrors((e) => ({ ...e, email: undefined }))
            }}
            placeholder={t('auth.email_placeholder')}
            keyboardType='email-address'
            autoCapitalize='none'
            error={fieldErrors.email}
          />

          <View>
            <TextField
              label={t('auth.password')}
              value={password}
              onChangeText={(v) => {
                setPassword(v)
                if (fieldErrors.password)
                  setFieldErrors((e) => ({ ...e, password: undefined }))
              }}
              placeholder={t('auth.password_placeholder', 'Your password')}
              isPassword
              error={fieldErrors.password}
            />
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={onForgotPassword}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.forgotText}>{t('auth.forgot_password')}</Text>
            </TouchableOpacity>
          </View>

          {error ? <ErrorBanner message={error} /> : null}

          <PrimaryButton
            label={t('auth.login')}
            loadingLabel={t('auth.loading.login')}
            loading={loading}
            onPress={handleLogin}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('common.or', 'or')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={onCreateAccount}
          activeOpacity={0.85}
        >
          <Text style={styles.createText}>{t('auth.register')}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[12],
    paddingBottom: Spacing[8],
    flexGrow: 1,
  },
  logoBlock: { alignItems: 'center', marginBottom: Spacing[10] },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius['2xl'],
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  subtitle: { color: Colors.mutedForeground, fontSize: FontSize.base },
  form: { gap: Spacing[4] },
  forgotButton: { alignSelf: 'flex-end', marginTop: Spacing[2] },
  forgotText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  submitButton: { marginTop: Spacing[2] },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginTop: Spacing[8],
    marginBottom: Spacing[4],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerText: { color: '#9ca3af', fontSize: FontSize.sm },
  createButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    alignItems: 'center',
  },
  createText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
})
