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
import { CheckCircle } from 'lucide-react-native'
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

const ROLE_LABELS: Record<RoleChoice, string> = {
  TRAVELER: 'Traveler',
  SENDER: 'Sender',
  BOTH: 'Traveler & Sender',
}

const DOCUMENT_TYPES: {
  id: DocumentType
  label: string
  emoji: string
  description: string
}[] = [
  {
    id: 'CNI',
    label: 'National ID Card',
    emoji: '🪪',
    description: "Carte Nationale d'Identité",
  },
  {
    id: 'PASSPORT',
    label: 'Passport',
    emoji: '📔',
    description: 'Valid international passport',
  },
]

export function KycUploadScreen({
  role,
  kycStatus,
  onBack,
  onSuccess,
  onSkip,
}: KycUploadScreenProps) {
  const [documentType, setDocumentType] = useState<DocumentType | null>(null)
  const [idFrontUri, setIdFrontUri] = useState<string | null>(null)
  const [idBackUri, setIdBackUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmUpdate, setConfirmUpdate] = useState(false)

  const isVerified = kycStatus === 'VERIFIED'

  const pickImage = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Go Bagage needs access to your photos to upload your ID document.',
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
      if (side === 'front') setIdFrontUri(uri)
      else setIdBackUri(uri)
    }
  }

  const handleSubmit = async () => {
    if (!documentType) {
      setError('Please select a document type.')
      return
    }
    if (!idFrontUri) {
      setError('Please upload the front of your document.')
      return
    }
    if (!idBackUri) {
      setError('Please upload the back of your document.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('frontFile', {
        uri: idFrontUri,
        name: 'front_document.jpg',
        type: 'image/jpeg',
      } as any)

      formData.append('backFile', {
        uri: idBackUri,
        name: 'back_document.jpg',
        type: 'image/jpeg',
      } as any)

      formData.append('documentType', documentType)

      await apiClient.post('/users/me/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      onSuccess()
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'Failed to submit documents. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  if (isVerified && !confirmUpdate) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AuthHeader roleLabel={ROLE_LABELS[role]} onBack={onBack} />
        <View style={styles.verifiedContent}>
          <View style={styles.verifiedIconCircle}>
            <CheckCircle size={48} color={Colors.primary} />
          </View>
          <Text style={styles.verifiedTitle}>Identity already verified</Text>
          <Text style={styles.verifiedSubtitle}>
            Your identity has been successfully verified. You don't need to
            submit new documents unless your ID has expired or changed.
          </Text>

          <View style={styles.verifiedActions}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => setConfirmUpdate(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.updateButtonText}>
                Update my documents anyway
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.85}
            >
              <Text style={styles.backButtonText}>Go back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AuthHeader roleLabel={ROLE_LABELS[role]} onBack={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isVerified && <AuthProgressSteps currentStep={2} />}

        {isVerified && confirmUpdate && (
          <View style={styles.updateBanner}>
            <Text style={styles.updateBannerText}>
              ⚠️ You are updating your already verified documents. This will
              require a new review.
            </Text>
          </View>
        )}

        <Text style={styles.title}>
          {isVerified ? 'Update your documents' : 'Verify your identity'}
        </Text>
        <Text style={styles.subtitle}>
          Select your document type and upload both sides.
        </Text>

        <Text style={styles.sectionLabel}>Document type</Text>
        <View style={styles.docTypeRow}>
          {DOCUMENT_TYPES.map((doc) => {
            const isSelected = documentType === doc.id
            return (
              <TouchableOpacity
                key={doc.id}
                style={[
                  styles.docTypeCard,
                  isSelected && styles.docTypeCardSelected,
                ]}
                onPress={() => {
                  setDocumentType(doc.id)
                  setIdFrontUri(null)
                  setIdBackUri(null)
                  setError('')
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

        {documentType && (
          <>
            <Text style={styles.sectionLabel}>Upload photos</Text>
            <View style={styles.infoBanner}>
              <Text style={styles.infoEmoji}>ℹ️</Text>
              <Text style={styles.infoText}>
                Your documents are encrypted and only used for identity
                verification. They are never shared with other users.
              </Text>
            </View>

            <View style={styles.uploadList}>
              <IdUploadCard
                label={`Front of ${documentType === 'CNI' ? 'ID Card' : 'Passport'}`}
                uploadedUri={idFrontUri}
                onPress={() => pickImage('front')}
              />
              <IdUploadCard
                label={`Back of ${documentType === 'CNI' ? 'ID Card' : 'Passport'}`}
                uploadedUri={idBackUri}
                onPress={() => pickImage('back')}
              />
            </View>
          </>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <PrimaryButton
          label='Submit Documents'
          loadingLabel='Submitting...'
          loading={loading}
          onPress={handleSubmit}
          style={styles.submitButton}
        />

        {!isVerified && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[6],
  },
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
  verifiedActions: {
    width: '100%',
    gap: Spacing[3],
  },
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
    marginBottom: Spacing[5],
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
  uploadList: {
    gap: Spacing[4],
    marginBottom: Spacing[2],
  },
  errorText: {
    color: Colors.destructive,
    fontSize: FontSize.sm,
    marginTop: Spacing[3],
  },
  submitButton: { marginTop: Spacing[6] },
  skipButton: {
    paddingVertical: Spacing[2],
    marginTop: Spacing[3],
    alignItems: 'center',
  },
  skipText: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
  },
})
