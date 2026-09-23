import { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, CheckCircle, XCircle, ZoomIn } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import type { KycQueueItem } from '../types/admin.types'
import { toAbsoluteFileUrl } from '../../../shared/utils/url.utils'

interface KycReviewScreenProps {
  item: KycQueueItem
  onBack: () => void
  onApprove: (kycId: string) => Promise<boolean>
  onReject: (kycId: string, note: string) => Promise<boolean>
}

export function KycReviewScreen({
  item,
  onBack,
  onApprove,
  onReject,
}: KycReviewScreenProps) {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [rejectModalVisible, setRejectModal] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const frontImageUrl = toAbsoluteFileUrl(item.frontDocumentUrl)
  const backImageUrl = toAbsoluteFileUrl(item.backDocumentUrl)

  const fullName = `${item.userFirstName} ${item.userLastName}`
  const submittedAt = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(item.submittedAt))

  const handleApprove = async () => {
    setLoading(true)
    const ok = await onApprove(item.kycId)
    setLoading(false)
    if (ok) onBack()
  }

  const handleReject = async () => {
    if (!rejectNote.trim()) return
    setLoading(true)
    const ok = await onReject(item.kycId, rejectNote.trim())
    setLoading(false)
    if (ok) {
      setRejectModal(false)
      onBack()
    }
  }

  const isPending = item.status === 'PENDING' || item.status === 'UNDER_REVIEW'

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
          <Text style={styles.headerTitle}>
            {t('admin.kyc_review', 'KYC Review')}
          </Text>
          <Text style={styles.headerSubtitle}>{fullName}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>
            {t('admin.user_info', 'User Information')}
          </Text>
          <InfoRow label={t('admin.full_name', 'Full name')} value={fullName} />
          <InfoRow label={t('admin.email', 'Email')} value={item.userEmail} />
          <InfoRow
            label={t('admin.doc_type', 'Document type')}
            value={item.documentType ?? '—'}
          />
          <InfoRow
            label={t('admin.submitted', 'Submitted')}
            value={submittedAt}
          />
          <InfoRow
            label={t('admin.status_label', 'Status')}
            value={item.status}
            highlight
          />
        </View>

        <Text style={styles.sectionTitle}>
          {t('admin.identity_docs', 'Identity Documents')}
        </Text>

        <Text style={styles.docLabel}>{t('kyc.front')}</Text>
        <TouchableOpacity
          onPress={() => frontImageUrl && setZoomedImage(frontImageUrl)}
          activeOpacity={0.9}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: frontImageUrl }}
              style={styles.docImage}
              resizeMode='contain'
            />
            <View style={styles.zoomHint}>
              <ZoomIn size={16} color={Colors.white} />
              <Text style={styles.zoomText}>
                {t('admin.tap_zoom', 'Tap to zoom')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {backImageUrl && (
          <>
            <Text style={styles.docLabel}>{t('kyc.back')}</Text>
            <TouchableOpacity
              onPress={() => setZoomedImage(backImageUrl)}
              activeOpacity={0.9}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: backImageUrl }}
                  style={styles.docImage}
                  resizeMode='contain'
                />
                <View style={styles.zoomHint}>
                  <ZoomIn size={16} color={Colors.white} />
                  <Text style={styles.zoomText}>
                    {t('admin.tap_zoom', 'Tap to zoom')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}

        {isPending && (
          <View style={styles.decisionRow}>
            <TouchableOpacity
              style={[styles.decisionButton, styles.rejectButton]}
              onPress={() => setRejectModal(true)}
              activeOpacity={0.85}
              disabled={loading}
            >
              <XCircle size={18} color={Colors.destructive} />
              <Text style={styles.rejectLabel}>{t('admin.reject')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.decisionButton, styles.approveButton]}
              onPress={handleApprove}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size='small' color={Colors.white} />
              ) : (
                <>
                  <CheckCircle size={18} color={Colors.white} />
                  <Text style={styles.approveLabel}>{t('admin.approve')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {!isPending && (
          <View
            style={[
              styles.alreadyReviewed,
              {
                backgroundColor:
                  item.status === 'VERIFIED' ? '#e8faf0' : '#fef2f2',
              },
            ]}
          >
            <View style={styles.alreadyReviewedRow}>
              {item.status === 'VERIFIED' ? (
                <CheckCircle size={18} color={Colors.primary} />
              ) : (
                <XCircle size={18} color={Colors.destructive} />
              )}
              <Text
                style={{
                  color:
                    item.status === 'VERIFIED'
                      ? Colors.primary
                      : Colors.destructive,
                  fontWeight: FontWeight.bold,
                  fontSize: FontSize.base,
                }}
              >
                {item.status === 'VERIFIED'
                  ? t('admin.already_approved', 'Already approved')
                  : t('admin.already_rejected', 'Already rejected')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={rejectModalVisible} transparent animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('admin.reject_kyc', 'Reject KYC')}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t(
                'admin.reject_subtitle',
                'Please provide a reason. The user will be notified.',
              )}
            </Text>
            <TextInput
              value={rejectNote}
              onChangeText={setRejectNote}
              placeholder={t(
                'admin.reject_placeholder',
                'e.g. Document is blurry, ID expired...',
              )}
              placeholderTextColor='#9ca3af'
              multiline
              numberOfLines={4}
              style={styles.noteInput}
              textAlignVertical='top'
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setRejectModal(false)
                  setRejectNote('')
                }}
              >
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmRejectButton,
                  !rejectNote.trim() && styles.disabledButton,
                ]}
                onPress={handleReject}
                disabled={!rejectNote.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator size='small' color={Colors.white} />
                ) : (
                  <Text style={styles.confirmRejectText}>
                    {t('admin.confirm_reject', 'Confirm Reject')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!zoomedImage} transparent animationType='fade'>
        <TouchableOpacity
          style={styles.zoomOverlay}
          onPress={() => setZoomedImage(null)}
          activeOpacity={1}
        >
          {zoomedImage && (
            <Image
              source={{ uri: zoomedImage }}
              style={styles.zoomedImage}
              resizeMode='contain'
            />
          )}
          <Text style={styles.zoomClose}>
            {t('admin.tap_close', 'Tap to close')}
          </Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={[infoStyles.value, highlight && infoStyles.highlight]}>
        {value}
      </Text>
    </View>
  )
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  label: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  value: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    fontWeight: FontWeight.medium,
  },
  highlight: { color: Colors.warning, fontWeight: FontWeight.bold },
})

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
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[10],
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[5],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[3],
  },
  docLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  imageWrapper: {
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    marginBottom: Spacing[4],
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  docImage: { width: '100%', height: 200 },
  zoomHint: {
    position: 'absolute',
    bottom: Spacing[2],
    right: Spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  zoomText: { color: Colors.white, fontSize: 11 },
  decisionRow: { flexDirection: 'row', gap: Spacing[3], marginTop: Spacing[4] },
  decisionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[4],
    borderRadius: Radius.xl,
  },
  rejectButton: {
    borderWidth: 2,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  rejectLabel: {
    color: Colors.destructive,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  approveButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  approveLabel: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  alreadyReviewed: {
    padding: Spacing[4],
    borderRadius: Radius['2xl'],
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  alreadyReviewedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing[6],
    paddingBottom: Spacing[10],
  },
  modalTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  modalSubtitle: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    marginBottom: Spacing[4],
  },
  noteInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    padding: Spacing[4],
    fontSize: FontSize.base,
    color: Colors.foreground,
    minHeight: 100,
    marginBottom: Spacing[4],
  },
  modalActions: { flexDirection: 'row', gap: Spacing[3] },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing[4],
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  confirmRejectButton: {
    flex: 1,
    paddingVertical: Spacing[4],
    borderRadius: Radius.xl,
    backgroundColor: Colors.destructive,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.5 },
  confirmRejectText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  zoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomedImage: { width: '100%', height: '85%' },
  zoomClose: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSize.sm,
    marginTop: Spacing[4],
  },
})
