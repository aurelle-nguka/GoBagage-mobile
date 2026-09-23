import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { X, User as UserIcon, Check } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { updateProfile } from '../api/users.api'
import { useAuthStore } from '../../../store/auth.store'
import type { User } from '../../../types/user.types'

interface EditProfileModalProps {
  visible: boolean
  user: User
  onClose: () => void
  onSuccess?: () => void
}

export function EditProfileModal({
  visible,
  user,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const { t } = useTranslation()
  const { setUser } = useAuthStore()

  const [firstName, setFirstName] = useState(user.firstName || '')
  const [lastName, setLastName] = useState(user.lastName || '')
  const [bio, setBio] = useState(user.bio || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (visible) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setBio(user.bio || '')
      setError('')
    }
  }, [visible, user])

  const handleSave = async () => {
    if (!firstName.trim()) {
      setError(t('auth.errors.first_name_required', 'Le prénom est obligatoire.'))
      return
    }
    if (!lastName.trim()) {
      setError(t('auth.errors.last_name_required', 'Le nom est obligatoire.'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const updatedDto = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
      })

      setUser({
        ...user,
        firstName: updatedDto.firstName,
        lastName: updatedDto.lastName,
        bio: updatedDto.bio ?? undefined,
        totalDeliveries: updatedDto.totalDeliveries ?? user.totalDeliveries ?? 0,
        subscriptionType: updatedDto.subscriptionPlan ?? user.subscriptionType ?? 'FREE',
        profilePhoto: updatedDto.profilePhotoUrl ?? user.profilePhoto,
        averageRating: updatedDto.averageRating ?? user.averageRating ?? 0,
      })

      Alert.alert(
        t('common.confirm', 'Succès'),
        t('profile.update_success', 'Profil mis à jour avec succès !'),
      )
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          t('common.error', 'Une erreur inattendue est survenue.'),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {t('profile.edit', 'Modifier le Profil')}
              </Text>
              <Text style={styles.subtitle}>
                {t('profile.edit_subtitle', 'Mettez à jour vos informations personnelles')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.form}
            keyboardShouldPersistTaps="handled"
          >
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            {/* Prénom */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {t('auth.first_name', 'Prénom')} *
              </Text>
              <View style={styles.inputContainer}>
                <UserIcon size={18} color={Colors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={(val) => {
                    setFirstName(val)
                    setError('')
                  }}
                  placeholder={t('auth.first_name_placeholder', 'Jean')}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Nom */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {t('auth.last_name', 'Nom')} *
              </Text>
              <View style={styles.inputContainer}>
                <UserIcon size={18} color={Colors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={(val) => {
                    setLastName(val)
                    setError('')
                  }}
                  placeholder={t('auth.last_name_placeholder', 'Dupont')}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Bio */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {t('profile.bio', 'Bio')}
              </Text>
              <View style={[styles.inputContainer, styles.bioContainer]}>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder={t('profile.bio_placeholder', 'Parlez-nous un peu de vous...')}
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Email note */}
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                📧 {user.email} · {t('profile.email_note', "L'email ne peut pas être modifié.")}
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <View style={styles.saveContent}>
                  <Check size={18} color={Colors.white} />
                  <Text style={styles.saveText}>
                    {t('profile.save_changes', 'Enregistrer')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[8],
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: Spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: Spacing[4],
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: Radius.lg,
    padding: Spacing[3],
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.sm,
  },
  field: {
    gap: Spacing[1],
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing[3],
    backgroundColor: '#f9fafb',
  },
  inputIcon: {
    marginRight: Spacing[2],
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: FontSize.sm,
    color: Colors.foreground,
  },
  bioContainer: {
    paddingVertical: Spacing[2],
  },
  bioInput: {
    height: 70,
  },
  noteBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: Radius.lg,
    padding: Spacing[3],
  },
  noteText: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    lineHeight: FontSize.xs * 1.5,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  saveText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
})
