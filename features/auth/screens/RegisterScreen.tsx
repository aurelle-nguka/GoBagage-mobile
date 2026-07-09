/**
 * Go Bagage — RegisterScreen
 * Étape 1 : inscription. Champs alignés sur le contrat OpenAPI.
 * Validation Zod côté client avant l'appel API.
 * Le backend envoie automatiquement l'OTP SMS après inscription réussie.
 */

import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { AuthHeader } from '../components/AuthHeader'
import { AuthProgressSteps } from '../components/AuthProgressSteps'
import { UserRole } from '../../../types/user.types'
import { TextField } from '../../../shared/components/ui/TextField'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { useRegister } from '../hooks/useRegister'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

interface RegisterScreenProps {
  role: RoleChoice
  onBack: () => void
  onSuccess: (data: { phone: string }) => void
  onLogin: () => void
}

const ROLE_LABELS: Record<RoleChoice, string> = {
  TRAVELER: 'Traveler',
  SENDER: 'Sender',
  BOTH: 'Traveler & Sender',
}

function roleChoiceToRoles(role: RoleChoice): UserRole[] {
  return role === 'BOTH' ? ['TRAVELER', 'SENDER'] : [role]
}

export function RegisterScreen({
  role,
  onBack,
  onSuccess,
  onLogin,
}: RegisterScreenProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const { loading, error, submit } = useRegister()

  const handleSubmit = async () => {
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <AuthHeader roleLabel={ROLE_LABELS[role]} onBack={onBack} />

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
        <AuthProgressSteps currentStep={0} />

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Join thousands of global travelers and senders.
        </Text>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <TextField
                label='First name *'
                value={firstName}
                onChangeText={setFirstName}
                placeholder='Jean'
                autoCapitalize='words'
              />
            </View>
            <View style={styles.nameField}>
              <TextField
                label='Last name *'
                value={lastName}
                onChangeText={setLastName}
                placeholder='Dupont'
                autoCapitalize='words'
              />
            </View>
          </View>

          <TextField
            label='Email address *'
            value={email}
            onChangeText={setEmail}
            placeholder='jean.dupont@email.com'
            keyboardType='email-address'
            autoCapitalize='none'
          />

          <View>
            <TextField
              label='Phone number *'
              value={phone}
              onChangeText={setPhone}
              placeholder='+237650255873'
              keyboardType='phone-pad'
            />
            <Text style={styles.hint}>
              International format required (e.g. +237650255873). We'll send a
              verification code.
            </Text>
          </View>

          <View>
            <TextField
              label='Password *'
              value={password}
              onChangeText={setPassword}
              placeholder='Min. 8 chars, uppercase, number, special char'
              isPassword
            />
            <Text style={styles.hint}>
              At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1
              special character
            </Text>
          </View>

          {error ? <ErrorBanner message={error} /> : null}

          <PrimaryButton
            label='Create Account'
            loadingLabel='Creating account...'
            loading={loading}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginHighlight}>Log in</Text>
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
