import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import apiClient from '../../../shared/services/api.client'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface OpenDisputeModalProps {
  visible: boolean
  onClose: () => void
  bookingId: string | number
}

const DISPUTE_REASONS = [
  { id: 'PACKAGE_DAMAGED', label: 'Colis endommagé' },
  { id: 'PACKAGE_LOST', label: 'Colis non reçu / perdu' },
  { id: 'DELIVERY_DELAY', label: 'Retard important de livraison' },
  { id: 'NON_COMPLIANT', label: 'Contenu non conforme à la déclaration' },
  { id: 'OTHER', label: 'Autre motif de litige' },
] as const

export function OpenDisputeModal({
  visible,
  onClose,
  bookingId,
}: OpenDisputeModalProps) {
  const { t } = useTranslation()
  const [selectedReason, setSelectedReason] =
    useState<string>('PACKAGE_DAMAGED')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    if (loading) return
    setSelectedReason('PACKAGE_DAMAGED')
    setDescription('')
    setSuccess(false)
    setError('')
    onClose()
  }

  const handleSubmit = async () => {
    if (!bookingId) return
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/disputes', {
        bookingId: Number(bookingId),
        reason: selectedReason,
        description: description.trim() || undefined,
      })
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          t('messaging.dispute.failed', "Échec de l'ouverture du litige."),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <AlertTriangle size={20} color={Colors.warning} />
              <Text style={styles.title}>
                {t('messaging.dispute.title', 'Déclarer un litige')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={styles.successContainer}>
              <CheckCircle2 size={48} color={Colors.primary} />
              <Text style={styles.successTitle}>
                {t('messaging.dispute.opened', 'Litige ouvert')}
              </Text>
              <Text style={styles.successSub}>
                {t(
                  'messaging.dispute.opened_sub',
                  "Votre réclamation a été transmise aux administrateurs. Les fonds sous séquestre sont bloqués jusqu'à la résolution.",
                )}
              </Text>
            </View>
          ) : (
            <View style={styles.content}>
              <Text style={styles.subtext}>
                {t(
                  'messaging.dispute.prompt',
                  'Sélectionnez le motif du litige pour la réservation',
                )}{' '}
                #{bookingId} :
              </Text>

              <View style={styles.reasonsList}>
                {DISPUTE_REASONS.map((r) => {
                  const isSelected = selectedReason === r.id
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[
                        styles.reasonItem,
                        isSelected && styles.reasonItemSelected,
                      ]}
                      onPress={() => setSelectedReason(r.id)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.radio,
                          isSelected && styles.radioSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          styles.reasonText,
                          isSelected && styles.reasonTextSelected,
                        ]}
                      >
                        {t(`disputes.reasons.${r.id.toLowerCase()}`, r.label)}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>

              <Text style={styles.label}>
                {t(
                  'messaging.dispute.details_label',
                  'Explication du problème',
                )}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t(
                  'messaging.dispute.details_placeholder',
                  'Décrivez en détail la situation...',
                )}
                placeholderTextColor='#9ca3af'
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical='top'
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleClose}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>
                    {t('common.cancel', 'Annuler')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    loading && styles.submitBtnDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size='small' color={Colors.white} />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {t('messaging.dispute.submit', 'Ouvrir le litige')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  content: {
    gap: Spacing[3],
  },
  subtext: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    marginBottom: 4,
  },
  reasonsList: {
    gap: Spacing[2],
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: Spacing[3],
  },
  reasonItemSelected: {
    borderColor: Colors.warning,
    backgroundColor: '#fff8e8',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.warning,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
  },
  reasonText: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    flex: 1,
  },
  reasonTextSelected: {
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Radius.lg,
    padding: Spacing[3],
    fontSize: FontSize.sm,
    color: Colors.foreground,
    minHeight: 70,
    backgroundColor: '#f9fafb',
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.destructive,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginTop: Spacing[2],
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing[6],
    gap: Spacing[3],
  },
  successTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  successSub: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing[2],
  },
})
