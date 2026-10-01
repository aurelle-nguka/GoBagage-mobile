import { useState, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { CheckCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { AuthHeader } from '../components/AuthHeader'
import { AuthProgressSteps } from '../components/AuthProgressSteps'
import { IdUploadCard } from '../components/IdUploadCard'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import apiClient from '../../../shared/services/api.client'
import type { KycStatus } from '../../../types/user.types'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'
type DocumentType = 'CNI' | 'PASSPORT'

interface KycUploadScreenProps {
  role: RoleChoice
  kycStatus?: KycStatus
  onBack: () => void
  onSuccess: () => void
  onSkip: () => void
}

export function KycUploadScreen({
  role,
  kycStatus,
  onBack,
  onSuccess,
  onSkip,
}: KycUploadScreenProps) {
  const { t } = useTranslation()
  const [documentType, setDocumentType] = useState<DocumentType | null>(null)
  const [idFrontUri, setIdFrontUri] = useState<string | null>(null)
  const [idBackUri, setIdBackUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmUpdate, setConfirmUpdate] = useState(false)

  const [docTypeError, setDocTypeError] = useState('')
  const [frontError, setFrontError] = useState('')
  const [backError, setBackError] = useState('')
  const [apiError, setApiError] = useState('')

  const isVerified = kycStatus === 'VERIFIED'

  const roleLabel = useMemo(() => {
    switch (role) {
      case 'TRAVELER':
        return t('roles.traveler', { defaultValue: 'Traveler' })
      case 'SENDER':
        return t('roles.sender', { defaultValue: 'Sender' })
      case 'BOTH':
      default:
        return t('roles.both', { defaultValue: 'Traveler & Sender' })
    }
  }, [role, t])

  const documentTypes = useMemo<
    {
      id: DocumentType
      label: string
      emoji: string
      description: string
    }[]
  >(
    () => [
      {
        id: 'CNI',
        label: t('kyc.cni_label', { defaultValue: 'National ID Card' }),
        emoji: '🪪',
        description: t('kyc.cni_desc', {
          defaultValue: "Carte Nationale d'Identité",
        }),
      },
      {
        id: 'PASSPORT',
        label: t('kyc.passport_label', { defaultValue: 'Passport' }),
        emoji: '📔',
        description: t('kyc.passport_desc', {
          defaultValue: 'Valid international passport',
        }),
      },
    ],
    [t],
  )

  const pickImage = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        t('kyc.permission_title', { defaultValue: 'Permission required' }),
        t('kyc.permission_photos', {
          defaultValue: 'Go Bagage needs access to your photos.',
        }),
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    })

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri
      if (side === 'front') {
        setIdFrontUri(uri)
        setFrontError('')
      } else {
        setIdBackUri(uri)
        setBackError('')
      }
    }
  }

  const validate = (): boolean => {
    let valid = true

    if (!documentType) {
      setDocTypeError(
        t('kyc.doc_type_error', {
          defaultValue: 'Please select a document type.',
        }),
      )
      valid = false
    } else {
      setDocTypeError('')
    }

    if (!idFrontUri) {
      setFrontError(
        t('kyc.front_error', {
          defaultValue: 'Please upload the front of your document.',
        }),
      )
      valid = false
    } else {
      setFrontError('')
    }

    if (!idBackUri) {
      setBackError(
        t('kyc.back_error', {
          defaultValue: 'Please upload the back of your document.',
        }),
      )
      valid = false
    } else {
      setBackError('')
    }

    return valid
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setApiError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('frontFile', {
        uri: idFrontUri!,
        name: 'front_document.jpg',
        type: 'image/jpeg',
      } as any)
      formData.append('backFile', {
        uri: idBackUri!,
        name: 'back_document.jpg',
        type: 'image/jpeg',
      } as any)
      formData.append('documentType', documentType!)

      await apiClient.post('/users/me/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onSuccess()
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ??
          t('common.error', {
            defaultValue: 'Failed to submit documents. Please try again.',
          }),
      )
    } finally {
      setLoading(false)
    }
  }

  if (isVerified && !confirmUpdate) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AuthHeader roleLabel={roleLabel} onBack={onBack} />
        <View style={styles.verifiedContent}>
          <View style={styles.verifiedIconCircle}>
            <CheckCircle size={48} color={Colors.primary} />
          </View>
          <Text style={styles.verifiedTitle}>
            {t('kyc.verified_title', {
              defaultValue: 'Identity already verified',
            })}
          </Text>
          <Text style={styles.verifiedSubtitle}>
            {t('kyc.verified_desc', {
              defaultValue:
                "Your identity has been successfully verified. You don't need to submit new documents unless your ID has expired or changed.",
            })}
          </Text>
          <View style={styles.verifiedActions}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setConfirmUpdate(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.updateButtonText}>
                {t('kyc.update_anyway', {
                  defaultValue: 'Update my documents anyway',
                })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.85}
            >
              <Text style={styles.backButtonText}>
                {t('kyc.go_back', { defaultValue: 'Go back' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AuthHeader roleLabel={roleLabel} onBack={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isVerified && <AuthProgressSteps currentStep={2} />}

        {isVerified && confirmUpdate && (
          <View style={styles.updateBanner}>
            <Text style={styles.updateBannerText}>
              {t('kyc.update_warning', {
                defaultValue:
                  'You are updating your already verified documents. This will require a new review.',
              })}
            </Text>
          </View>
        )}

        <Text style={styles.title}>
          {isVerified
            ? t('kyc.title_update', { defaultValue: 'Update your documents' })
            : t('kyc.title', { defaultValue: 'Verify your identity' })}
        </Text>
        <Text style={styles.subtitle}>
          {t('kyc.subtitle', {
            defaultValue: 'Select your document type and upload both sides.',
          })}
        </Text>

        <Text style={styles.sectionLabel}>
          {t('kyc.doc_type', { defaultValue: 'Document type' })} *
        </Text>
        <View style={styles.docTypeRow}>
          {documentTypes.map((doc) => {
            const isSelected = documentType === doc.id
            return (
              <TouchableOpacity
                key={doc.id}
                style={[
                  styles.docTypeCard,
                  isSelected && styles.docTypeCardSelected,
                  docTypeError ? styles.docTypeCardError : null,
                ]}
                onPress={() => {
                  setDocumentType(doc.id)
                  setIdFrontUri(null)
                  setIdBackUri(null)
                  setDocTypeError('')
                  setFrontError('')
                  setBackError('')
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.docTypeEmoji}>{doc.emoji}</Text>
                <Text
                  style={[
                    styles.docTypeLabel,
                    isSelected && styles.docTypeLabelSelected,
                  ]}
                >
                  {doc.label}
                </Text>
                <Text
                  style={[
                    styles.docTypeDesc,
                    isSelected && styles.docTypeDescSelected,
                  ]}
                >
                  {doc.description}
                </Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
        {docTypeError ? (
          <Text style={styles.fieldError}>{docTypeError}</Text>
        ) : null}

        {documentType && (
          <>
            <Text style={styles.sectionLabel}>
              {t('kyc.upload_section', { defaultValue: 'Upload photos' })}
            </Text>
            <View style={styles.infoBanner}>
              <Text style={styles.infoEmoji}></Text>
              <Text style={styles.infoText}>
                {t('kyc.encryption_notice', {
                  defaultValue:
                    'Your documents are encrypted and only used for identity verification.',
                })}
              </Text>
            </View>

            <View style={styles.uploadList}>
              <View>
                <IdUploadCard
                  label={
                    documentType === 'CNI'
                      ? t('kyc.front_cni', {
                          defaultValue: 'Front of ID Card *',
                        })
                      : t('kyc.front_passport', {
                          defaultValue: 'Passport Identity Page *',
                        })
                  }
                  uploadedUri={idFrontUri}
                  onPress={() => pickImage('front')}
                />
                {frontError ? (
                  <Text style={styles.fieldError}>{frontError}</Text>
                ) : null}
              </View>

              <View>
                <IdUploadCard
                  label={
                    documentType === 'CNI'
                      ? t('kyc.back_cni', { defaultValue: 'Back of ID Card *' })
                      : t('kyc.back_passport', {
                          defaultValue: 'Passport Page 2 *',
                        })
                  }
                  uploadedUri={idBackUri}
                  onPress={() => pickImage('back')}
                />
                {backError ? (
                  <Text style={styles.fieldError}>{backError}</Text>
                ) : null}
              </View>
            </View>
          </>
        )}

        {apiError ? (
          <Text style={[styles.fieldError, { marginTop: Spacing[3] }]}>
            {apiError}
          </Text>
        ) : null}

        <PrimaryButton
          label={t('kyc.submit', { defaultValue: 'Submit Documents' })}
          loadingLabel={t('kyc.submitting', { defaultValue: 'Submitting...' })}
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitButton}
        />

        {!isVerified && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>
              {t('kyc.skip', { defaultValue: 'Skip for now' })}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[6] },
  verifiedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  verifiedIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  verifiedTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: Spacing[3],
  },
  verifiedSubtitle: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
    marginBottom: Spacing[8],
  },
  verifiedActions: { width: '100%', gap: Spacing[3] },
  updateButton: {
    borderWidth: 1.5,
    borderColor: Colors.warning,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    alignItems: 'center',
    backgroundColor: '#fff8e8',
  },
  updateButtonText: {
    color: Colors.warning,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  updateBanner: {
    backgroundColor: '#fff8e8',
    borderWidth: 1,
    borderColor: '#ffe0b2',
    borderRadius: Radius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  updateBannerText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    lineHeight: FontSize.sm * 1.5,
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
    marginBottom: Spacing[5],
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
  },
  docTypeRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginBottom: Spacing[1],
  },
  docTypeCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    alignItems: 'center',
    backgroundColor: Colors.white,
    position: 'relative',
  },
  docTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#e8faf0',
  },
  docTypeCardError: { borderColor: Colors.destructive },
  docTypeEmoji: { fontSize: 28, marginBottom: Spacing[2] },
  docTypeLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: 2,
  },
  docTypeLabelSelected: { color: Colors.primary },
  docTypeDesc: {
    fontSize: 10,
    color: Colors.mutedForeground,
    textAlign: 'center',
  },
  docTypeDescSelected: { color: Colors.primary },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    backgroundColor: '#e8f4fd',
    borderWidth: 1,
    borderColor: '#bbdefb',
    borderRadius: Radius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  infoEmoji: { fontSize: 20 },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: '#1565C0',
    lineHeight: FontSize.sm * 1.5,
  },
  uploadList: { gap: Spacing[4], marginBottom: Spacing[2] },
  fieldError: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
  submitButton: { marginTop: Spacing[6] },
  skipButton: {
    paddingVertical: Spacing[2],
    marginTop: Spacing[3],
    alignItems: 'center',
  },
  skipText: { color: Colors.mutedForeground, fontSize: FontSize.base },
})
