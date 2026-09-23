import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Scale, CheckCircle2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { TextField } from '../../../shared/components/ui/TextField'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { useOpenDispute } from '../hooks/useOpenDispute'
import { DISPUTE_REASONS, type DisputeReasonCode } from '../constants/disputeReasons'

interface ReportProblemScreenProps {
  bookingId: string
  onBack: () => void
  onDone: () => void
}

export function ReportProblemScreen({ bookingId, onBack, onDone }: ReportProblemScreenProps) {
  const { t } = useTranslation()
  const { loading, error, submit } = useOpenDispute()
  const [reason, setReason] = useState<DisputeReasonCode | null>(null)
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [validationError, setValidationError] = useState('')

  const reasonLabel = (code: DisputeReasonCode) =>
    t(`disputes.reasons.${code}`, code.replace(/_/g, ' '))

  const handleSubmit = async () => {
    if (!reason) {
      setValidationError(t('disputes.errors.reason_required', 'Please select a reason.'))
      return
    }
    setValidationError('')
    const result = await submit({
      bookingId,
      reason,
      description: description.trim() || undefined,
    })
    if (result) setSubmitted(true)
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircle2 size={64} color={Colors.primary} />
          <Text style={styles.successTitle}>
            {t('disputes.submitted_title', 'Report Submitted')}
          </Text>
          <Text style={styles.successSubtitle}>
            {t(
              'disputes.submitted_subtitle',
              'Our team will review your report and get back to you shortly.',
            )}
          </Text>
          <PrimaryButton
            label={t('common.confirm', 'Done')}
            onPress={onDone}
            style={styles.doneButton}
          />
        </View>
      </SafeAreaView>
    )
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
        <Text style={styles.headerTitle}>
          {t('disputes.title', 'Report a Problem')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          {t(
            'disputes.subtitle',
            'Let us know what went wrong with this booking. Our team will investigate and take action.',
          )}
        </Text>

        {(error || validationError) ? (
          <ErrorBanner message={error || validationError} />
        ) : null}

        <Text style={styles.sectionLabel}>
          {t('disputes.reason_label', 'What happened?')}
        </Text>
        <View style={styles.reasonGrid}>
          {DISPUTE_REASONS.map((code) => {
            const isActive = code === reason
            return (
              <TouchableOpacity
                key={code}
                onPress={() => setReason(code)}
                activeOpacity={0.85}
                style={[styles.reasonChip, isActive && styles.reasonChipActive]}
              >
                <Text
                  style={[styles.reasonChipText, isActive && styles.reasonChipTextActive]}
                >
                  {reasonLabel(code)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <TextField
          label={t('disputes.description_label', 'Additional details (optional)')}
          value={description}
          onChangeText={setDescription}
          placeholder={t(
            'disputes.description_placeholder',
            'Describe what happened...',
          )}
          multiline
          numberOfLines={5}
          style={styles.descriptionInput}
        />

        <PrimaryButton
          label={t('disputes.submit_button', 'Submit Report')}
          loadingLabel={t('common.loading', 'Submitting...')}
          loading={loading}
          onPress={handleSubmit}
          icon={<Scale size={18} color={Colors.white} />}
          style={styles.submitButton}
        />
      </ScrollView>
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
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.foreground },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    marginBottom: Spacing[5],
  },
  sectionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginBottom: Spacing[5],
  },
  reasonChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: Colors.white,
  },
  reasonChipActive: {
    backgroundColor: '#fef2f2',
    borderColor: Colors.destructive,
  },
  reasonChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.foreground,
  },
  reasonChipTextActive: {
    color: Colors.destructive,
    fontWeight: FontWeight.bold,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: { marginTop: Spacing[6] },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    gap: Spacing[3],
  },
  successTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.foreground },
  successSubtitle: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    textAlign: 'center',
  },
  doneButton: { marginTop: Spacing[4], alignSelf: 'stretch' },
})
