import { useState } from 'react'
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
import { CheckCircle, Info, AlertTriangle, Check } from 'lucide-react-native'
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

  const ROLE_LABELS: Record<RoleChoice, string> = {
    TRAVELER: t('onboarding.traveler'),
    SENDER: t('onboarding.sender'),
    BOTH: `${t('onboarding.traveler')} & ${t('onboarding.sender')}`,
  }

  const DOCUMENT_TYPES: {
    id: DocumentType
    label: string
    description: string
  }[] = [
    {
      id: 'CNI',
      label: t('kyc.cni'),
      description: t('kyc.cni_desc', 'National Identity Card'),
    },
    {
      id: 'PASSPORT',
      label: t('kyc.passport'),
      description: t('kyc.passport_desc', 'Valid international passport'),
    },
  ]

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

  const pickImage = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        t('kyc.permission_title', 'Permission required'),
        t('kyc.permission_desc', 'Go Bagage needs access to your photos.'),
      )
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      setDocTypeError(t('kyc.errors.doc_type_required'))
      valid = false
    } else setDocTypeError('')
    if (!idFrontUri) {
      setFrontError(t('kyc.errors.front_required'))
      valid = false
    } else setFrontError('')
    if (!idBackUri) {
      setBackError(t('kyc.errors.back_required'))
      valid = false
    } else setBackError('')
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
      setApiError(err?.response?.data?.message ?? t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (isVerified && !confirmUpdate) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader roleLabel={ROLE_LABELS[role]} onBack={onBack} />
        <View style={styles.verifiedContent}>
          <View style={styles.verifiedIconCircle}>
            <CheckCircle size={48} color={Colors.primary} />
          </View>
          <Text style={styles.verifiedTitle}>{t('kyc.verified')}</Text>
          <Text style={styles.verifiedSubtitle}>
            {t(
              'kyc.verified_desc',
              "Your identity has been successfully verified. You don't need to submit new documents unless your ID has expired or changed.",
            )}
          </Text>
          <View style={styles.verifiedActions}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setConfirmUpdate(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.updateButtonText}>{t('kyc.update')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.85}
            >
              <Text style={styles.backButtonText}>{t('common.back')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader roleLabel={ROLE_LABELS[role]} onBack={onBack} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isVerified && <AuthProgressSteps currentStep={2} />}

        {isVerified && confirmUpdate && (
          <View style={[styles.updateBanner, styles.updateBannerRow]}>
            <AlertTriangle size={18} color={Colors.warning} />
            <Text style={[styles.updateBannerText, styles.updateBannerTextFlex]}>
              {t(
                'kyc.update_warning',
                'You are updating your already verified documents. This will require a new review.',
              )}
            </Text>
          </View>
        )}

        <Text style={styles.title}>
          {isVerified
            ? t('kyc.update_title', 'Update your documents')
            : t('kyc.title')}
        </Text>
        <Text style={styles.subtitle}>{t('kyc.subtitle')}</Text>

        <Text style={styles.sectionLabel}>{t('kyc.document_type')} *</Text>
        <View style={styles.docTypeRow}>
          {DOCUMENT_TYPES.map((doc) => {
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
                    <Check size={12} color={Colors.white} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
        {docTypeError ? <FieldError message={docTypeError} /> : null}

        {documentType && (
          <>
            <Text style={styles.sectionLabel}>
              {t('kyc.upload_photos', 'Upload photos')}
            </Text>
            <View style={styles.infoBanner}>
              <Info size={18} color='#1565C0' />
              <Text style={styles.infoText}>
                {t(
                  'kyc.info_text',
                  'Your documents are encrypted and only used for identity verification.',
                )}
              </Text>
            </View>

            <View style={styles.uploadList}>
              <View>
                <IdUploadCard
                  label={`${t('kyc.front')} ${documentType === 'CNI' ? t('kyc.id_card', 'ID Card') : t('kyc.passport')} *`}
                  uploadedUri={idFrontUri}
                  onPress={() => pickImage('front')}
                />
                {frontError ? <FieldError message={frontError} /> : null}
              </View>
              <View>
                <IdUploadCard
                  label={`${t('kyc.back')} ${documentType === 'CNI' ? t('kyc.id_card', 'ID Card') : t('kyc.passport')} *`}
                  uploadedUri={idBackUri}
                  onPress={() => pickImage('back')}
                />
                {backError ? <FieldError message={backError} /> : null}
              </View>
            </View>
          </>
        )}

        {apiError ? (
          <FieldError message={apiError} style={{ marginTop: Spacing[3] }} />
        ) : null}

        <PrimaryButton
          label={t('kyc.submit')}
          loadingLabel={t('kyc.loading')}
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitButton}
        />

        {!isVerified && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>{t('kyc.skip')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

function FieldError({
  message,
  style,
}: {
  message: string
  style?: object
}) {
  return (
    <View style={[styles.fieldErrorRow, style]}>
      <AlertTriangle size={13} color={Colors.destructive} />
      <Text style={styles.fieldError}>{message}</Text>
    </View>
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
  updateBannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
  },
  updateBannerText: {
    fontSize: FontSize.sm,
    color: Colors.warning,
    lineHeight: FontSize.sm * 1.5,
  },
  updateBannerTextFlex: {
    flex: 1,
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
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: '#1565C0',
    lineHeight: FontSize.sm * 1.5,
  },
  uploadList: { gap: Spacing[4], marginBottom: Spacing[2] },
  fieldErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing[1],
  },
  fieldError: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
  },
  submitButton: { marginTop: Spacing[6] },
  skipButton: {
    paddingVertical: Spacing[2],
    marginTop: Spacing[3],
    alignItems: 'center',
  },
  skipText: { color: Colors.mutedForeground, fontSize: FontSize.base },
})
