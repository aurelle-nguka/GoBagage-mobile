import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { ArrowLeft, CheckCircle2, XCircle, Wallet, RotateCcw } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { TextField } from '../../../shared/components/ui/TextField'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { useAdminDisputeDetail } from '../hooks/useAdminDisputeDetail'

interface DisputeDetailScreenProps {
  disputeId: string
  onBack: () => void
}

export function DisputeDetailScreen({ disputeId, onBack }: DisputeDetailScreenProps) {
  const { t, i18n } = useTranslation()
  const { dispute, loading, actionLoading, error, startInvestigation, decide, close } =
    useAdminDisputeDetail(disputeId)
  const [decision, setDecision] = useState<'RELEASE_FUNDS' | 'REFUND' | null>(null)
  const [note, setNote] = useState('')

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  if (!dispute) {
    return (
      <View style={styles.container}>
        <Header onBack={onBack} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    )
  }

  const createdAt = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dispute.createdAt))

  const handleDecide = async () => {
    if (!decision) return
    const ok = await decide(decision, note.trim() || undefined)
    if (ok) setNote('')
  }

  const handleClose = async () => {
    const ok = await close(note.trim() || undefined)
    if (ok) setNote('')
  }

  return (
    <View style={styles.container}>
      <Header onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? <ErrorBanner message={error} /> : null}

        <View style={styles.section}>
          <View style={styles.statusRow}>
            <Text style={styles.statusBadgeText}>
              {t(`admin.disputes.status_${dispute.status.toLowerCase()}`, dispute.status)}
            </Text>
          </View>
          <Text style={styles.reasonTitle}>
            {t(`disputes.reasons.${dispute.reason}`, dispute.reason.replace(/_/g, ' '))}
          </Text>
          {dispute.description && (
            <Text style={styles.description}>{dispute.description}</Text>
          )}
          <Text style={styles.metaText}>
            {t('booking.title', 'Booking')} #{dispute.bookingId}
          </Text>
          <Text style={styles.metaText}>{createdAt}</Text>
        </View>

        {dispute.status === 'OPEN' && (
          <View style={styles.section}>
            <PrimaryButton
              label={t('admin.disputes.investigate_button', 'Start Investigation')}
              loading={actionLoading}
              onPress={startInvestigation}
            />
          </View>
        )}

        {dispute.status === 'UNDER_INVESTIGATION' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {t('admin.disputes.decide_label', 'Decision')}
            </Text>
            <View style={styles.decisionRow}>
              <TouchableOpacity
                style={[
                  styles.decisionButton,
                  decision === 'RELEASE_FUNDS' && styles.decisionButtonActivePrimary,
                ]}
                onPress={() => setDecision('RELEASE_FUNDS')}
                activeOpacity={0.85}
              >
                <Wallet
                  size={18}
                  color={decision === 'RELEASE_FUNDS' ? Colors.white : Colors.primary}
                />
                <Text
                  style={[
                    styles.decisionButtonText,
                    decision === 'RELEASE_FUNDS' && styles.decisionButtonTextActive,
                  ]}
                >
                  {t('admin.disputes.release_funds', 'Release funds to traveler')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.decisionButton,
                  decision === 'REFUND' && styles.decisionButtonActiveDestructive,
                ]}
                onPress={() => setDecision('REFUND')}
                activeOpacity={0.85}
              >
                <RotateCcw
                  size={18}
                  color={decision === 'REFUND' ? Colors.white : Colors.destructive}
                />
                <Text
                  style={[
                    styles.decisionButtonText,
                    decision === 'REFUND' && styles.decisionButtonTextActive,
                  ]}
                >
                  {t('admin.disputes.refund_sender', 'Refund sender')}
                </Text>
              </TouchableOpacity>
            </View>

            <TextField
              label={t('admin.disputes.note_label', 'Note (optional)')}
              value={note}
              onChangeText={setNote}
              placeholder={t('admin.disputes.note_placeholder', 'Explain your decision...')}
              multiline
              numberOfLines={4}
              style={styles.noteInput}
            />

            <PrimaryButton
              label={t('admin.disputes.confirm_decision', 'Confirm Decision')}
              loading={actionLoading}
              disabled={!decision}
              onPress={handleDecide}
              style={{ marginTop: Spacing[3] }}
            />
          </View>
        )}

        {dispute.status === 'DECIDED' && (
          <View style={styles.section}>
            <View style={styles.decisionResultRow}>
              {dispute.decision === 'RELEASE_FUNDS' ? (
                <CheckCircle2 size={20} color={Colors.primary} />
              ) : (
                <XCircle size={20} color={Colors.destructive} />
              )}
              <Text style={styles.decisionResultText}>
                {dispute.decision === 'RELEASE_FUNDS'
                  ? t('admin.disputes.release_funds', 'Release funds to traveler')
                  : t('admin.disputes.refund_sender', 'Refund sender')}
              </Text>
            </View>
            {dispute.adminNotes && <Text style={styles.description}>{dispute.adminNotes}</Text>}

            <TextField
              label={t('admin.disputes.close_note_label', 'Closing note (optional)')}
              value={note}
              onChangeText={setNote}
              placeholder={t('admin.disputes.close_note_placeholder', 'Final remarks...')}
              multiline
              numberOfLines={3}
              style={styles.noteInput}
            />

            <PrimaryButton
              label={t('admin.disputes.close_button', 'Close Dispute')}
              loading={actionLoading}
              onPress={handleClose}
              style={{ marginTop: Spacing[3] }}
            />
          </View>
        )}

        {dispute.status === 'CLOSED' && (
          <View style={styles.section}>
            <View style={styles.decisionResultRow}>
              <CheckCircle2 size={20} color={Colors.primary} />
              <Text style={styles.decisionResultText}>
                {t('admin.disputes.closed_label', 'This dispute is closed.')}
              </Text>
            </View>
            {dispute.adminNotes && <Text style={styles.description}>{dispute.adminNotes}</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

function Header({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation()
  return (
    <View style={styles.headerBlock}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{t('admin.disputes.detail_title', 'Dispute')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: Colors.destructive, fontSize: FontSize.base, textAlign: 'center', paddingHorizontal: Spacing[8] },
  headerBlock: {
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
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
  },
  statusRow: { marginBottom: Spacing[2] },
  statusBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.destructive,
    textTransform: 'uppercase',
  },
  reasonTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.foreground, marginBottom: Spacing[2] },
  description: { fontSize: FontSize.base, color: Colors.foreground, marginBottom: Spacing[3] },
  metaText: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  sectionLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.foreground, marginBottom: Spacing[3] },
  decisionRow: { gap: Spacing[3], marginBottom: Spacing[4] },
  decisionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: Radius.xl,
    padding: Spacing[4],
  },
  decisionButtonActivePrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  decisionButtonActiveDestructive: { backgroundColor: Colors.destructive, borderColor: Colors.destructive },
  decisionButtonText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.foreground },
  decisionButtonTextActive: { color: Colors.white },
  noteInput: { minHeight: 80, textAlignVertical: 'top' },
  decisionResultRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[3] },
  decisionResultText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.foreground },
})
