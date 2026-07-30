import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { ArrowLeft } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { TextField } from '../../../shared/components/ui/TextField'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import apiClient from '../../../shared/services/api.client'
import type { User } from '../../../types/user.types'

interface EditProfileScreenProps {
  user: User
  onBack: () => void
  onSuccess: (updatedUser: Partial<User>) => void
}

interface FieldErrors {
  firstName?: string
  lastName?: string
  phone?: string
}

export function EditProfileScreen({
  user,
  onBack,
  onSuccess,
}: EditProfileScreenProps) {
  const { t } = useTranslation()
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [bio, setBio] = useState(user.bio ?? '')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const validate = (): boolean => {
    const errors: FieldErrors = {}
    if (!firstName.trim())
      errors.firstName = t('auth.errors.first_name_required')
    else if (firstName.trim().length < 2)
      errors.firstName = t('auth.errors.first_name_min')

    if (!lastName.trim()) errors.lastName = t('auth.errors.last_name_required')
    else if (lastName.trim().length < 2)
      errors.lastName = t('auth.errors.last_name_min')

    if (phone && !/^\+[1-9]\d{7,14}$/.test(phone.trim()))
      errors.phone = t('auth.errors.phone_invalid')

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setApiError('')
    setLoading(true)

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
      }

      await apiClient.put('/users/me', payload)
      Alert.alert(
        t('common.confirm', 'Success'),
        t('profile.update_success', 'Profile updated successfully!'),
      )
      onSuccess(payload)
    } catch (err: any) {
      setApiError(err?.response?.data?.message ?? t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{t('profile.edit')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('profile.edit_subtitle')}
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps='handled'
      >
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
            label={t('auth.phone')}
            value={phone}
            onChangeText={(v) => {
              setPhone(v)
              if (fieldErrors.phone)
                setFieldErrors((e) => ({ ...e, phone: undefined }))
            }}
            placeholder='+237650255873'
            keyboardType='phone-pad'
            error={fieldErrors.phone}
          />

          <TextField
            label={t('profile.bio', 'Bio')}
            value={bio}
            onChangeText={setBio}
            placeholder={t('profile.bio_placeholder')}
            multiline
          />

          <Text style={styles.note}>{t('profile.email_note')}</Text>

          {apiError ? <ErrorBanner message={apiError} /> : null}

          <PrimaryButton
            label={t('profile.save_changes')}
            loadingLabel={t('profile.saving')}
            loading={loading}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  form: { gap: Spacing[4] },
  nameRow: { flexDirection: 'row', gap: Spacing[3] },
  nameField: { flex: 1 },
  note: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: Spacing[4],
  },
  submitButton: { marginTop: Spacing[2] },
})
