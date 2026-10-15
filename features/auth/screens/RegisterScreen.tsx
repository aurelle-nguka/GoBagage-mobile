import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { AuthHeader } from '../components/AuthHeader'
import { AuthProgressSteps } from '../components/AuthProgressSteps'
import { UserRole } from '../../../types/user.types'
import { TextField } from '../../../shared/components/ui/TextField'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { useRegister } from '../hooks/useRegister'
import { PhoneField } from '../../../shared/components/ui/PhoneField'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

interface RegisterScreenProps {
  role: RoleChoice
  onBack: () => void
  onSuccess: (data: { phone: string }) => void
  onLogin: () => void
}

function roleChoiceToRoles(role: RoleChoice): UserRole[] {
  return role === 'BOTH' ? ['TRAVELER', 'SENDER'] : [role]
}

interface FieldErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
}

export function RegisterScreen({
  role,
  onBack,
  onSuccess,
  onLogin,
}: RegisterScreenProps) {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const { loading, error, submit } = useRegister()

  const ROLE_LABELS: Record<RoleChoice, string> = {
    TRAVELER: t('onboarding.traveler'),
    SENDER: t('onboarding.sender'),
    BOTH: `${t('onboarding.traveler')} & ${t('onboarding.sender')}`,
  }

  const validate = (): boolean => {
    const errors: FieldErrors = {}

    if (!firstName.trim())
      errors.firstName = t('auth.errors.first_name_required')
    else if (firstName.trim().length < 2)
      errors.firstName = t('auth.errors.first_name_min')

    if (!lastName.trim()) errors.lastName = t('auth.errors.last_name_required')
    else if (lastName.trim().length < 2)
      errors.lastName = t('auth.errors.last_name_min')

    if (!email.trim()) errors.email = t('auth.errors.email_required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = t('auth.errors.email_invalid')

    if (!phone.trim()) errors.phone = t('auth.errors.phone_required')

    if (!password) errors.password = t('auth.errors.password_required')
    else if (password.length < 8)
      errors.password = t('auth.errors.password_min')
    else if (!/[A-Z]/.test(password))
      errors.password = t('auth.errors.password_uppercase')
    else if (!/[0-9]/.test(password))
      errors.password = t('auth.errors.password_number')
    else if (!/[^a-zA-Z0-9]/.test(password))
      errors.password = t('auth.errors.password_special')

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    const result = await submit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      roles: roleChoiceToRoles(role),
    })
    if (result) onSuccess(result)
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader roleLabel={ROLE_LABELS[role]} onBack={onBack} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <AuthProgressSteps currentStep={0} />

        <Text style={styles.title}>{t('auth.register')}</Text>
        <Text style={styles.subtitle}>
          {t(
            'auth.register_subtitle',
            'Join thousands of global travelers and senders.',
          )}
        </Text>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <TextField
                label={`${t('auth.first_name')} *`}
                value={firstName}
                onChangeText={(v) => {
                  setFirstName(v)
                  if (fieldErrors.firstName)
                    setFieldErrors((e) => ({ ...e, firstName: undefined }))
                }}
                placeholder={t('auth.first_name_placeholder')}
                autoCapitalize='words'
                error={fieldErrors.firstName}
              />
            </View>
            <View style={styles.nameField}>
              <TextField
                label={`${t('auth.last_name')} *`}
                value={lastName}
                onChangeText={(v) => {
                  setLastName(v)
                  if (fieldErrors.lastName)
                    setFieldErrors((e) => ({ ...e, lastName: undefined }))
                }}
                placeholder={t('auth.last_name_placeholder')}
                autoCapitalize='words'
                error={fieldErrors.lastName}
              />
            </View>
          </View>

          <TextField
            label={`${t('auth.email')} *`}
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
            <PhoneField
              value={phone}
              onChangeText={(v) => {
                setPhone(v)
                if (fieldErrors.phone)
                  setFieldErrors((e) => ({ ...e, phone: undefined }))
              }}
              error={fieldErrors.phone}
            />
          </View>

          <View>
            <TextField
              label={`${t('auth.password')} *`}
              value={password}
              onChangeText={(v) => {
                setPassword(v)
                if (fieldErrors.password)
                  setFieldErrors((e) => ({ ...e, password: undefined }))
              }}
              placeholder={t(
                'auth.password_hint',
                'Min. 8 chars, uppercase, number, special char',
              )}
              isPassword
              error={fieldErrors.password}
            />
            {!fieldErrors.password && (
              <Text style={styles.hint}>
                {t(
                  'auth.password_hint',
                  'At least 8 characters, 1 uppercase, 1 number, 1 special character',
                )}
              </Text>
            )}
          </View>

          {error ? <ErrorBanner message={error} /> : null}

          <PrimaryButton
            label={t('auth.register')}
            loadingLabel={t('auth.loading.register')}
            loading={loading}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('common.or', 'or')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginText}>
            {t('auth.have_account')}{' '}
            <Text style={styles.loginHighlight}>{t('auth.login')}</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[6] },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  subtitle: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    marginBottom: Spacing[6],
  },
  form: { gap: Spacing[4] },
  nameRow: { flexDirection: 'row', gap: Spacing[3] },
  nameField: { flex: 1 },
  hint: { fontSize: FontSize.sm, color: '#9ca3af', marginTop: 4 },
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
  loginButton: {
    paddingVertical: Spacing[4],
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  loginText: { color: Colors.mutedForeground, fontSize: FontSize.base },
  loginHighlight: { color: Colors.primary, fontWeight: FontWeight.semibold },
})
