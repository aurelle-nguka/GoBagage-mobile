/**
 * Go Bagage — ReportUserModal
 * Modale de signalement d'utilisateur (CDC section 6.7).
 * Connecté à POST /api/v1/reports.
 */

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
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import apiClient from '../../../shared/services/api.client'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface ReportUserModalProps {
  visible: boolean
  onClose: () => void
  reportedUserId: string | number
  bookingId?: string | number
  reportedUserName: string
}

const REASONS = [
  { id: 'FRAUD', label: 'Fraude ou escroquerie' },
  { id: 'INAPPROPRIATE_CONTENT', label: 'Contenu inapproprié ou offensant' },
  { id: 'NO_SHOW', label: 'Absence au rendez-vous' },
  { id: 'DANGEROUS_ITEMS', label: 'Objets interdits ou dangereux' },
  { id: 'OTHER', label: 'Autre motif' },
] as const

export function ReportUserModal({
  visible,
  onClose,
  reportedUserId,
  bookingId,
  reportedUserName,
}: ReportUserModalProps) {
  const { t } = useTranslation()
  const [selectedReason, setSelectedReason] = useState<string>('FRAUD')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    if (loading) return
    setSelectedReason('FRAUD')
    setDescription('')
    setSuccess(false)
    setError('')
    onClose()
  }

  const handleSubmit = async () => {
    if (!reportedUserId) return
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/reports', {
        reportedUserId: Number(reportedUserId),
        bookingId: bookingId ? Number(bookingId) : undefined,
        reason: selectedReason,
        description: description.trim() || undefined,
      })
      setSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? t('messaging.report.failed', 'Échec de l\'envoi du signalement.'))
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
              <ShieldAlert size={20} color={Colors.destructive} />
              <Text style={styles.title}>{t('messaging.report.title', 'Signaler')}</Text>
            </View>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={styles.successContainer}>
              <CheckCircle2 size={48} color={Colors.primary} />
              <Text style={styles.successTitle}>{t('messaging.report.sent', 'Signalement envoyé')}</Text>
              <Text style={styles.successSub}>
                {t('messaging.report.sent_sub', 'Merci de nous aider à maintenir la communauté GoBagage en toute sécurité. Notre équipe va examiner ce dossier sous 24h.')}
              </Text>
            </View>
          ) : (
            <View style={styles.content}>
              <Text style={styles.subtext}>
                {t('messaging.report.user_prompt', 'Pourquoi souhaitez-vous signaler')} <Text style={{ fontWeight: '700' }}>{reportedUserName}</Text> ?
              </Text>

              <View style={styles.reasonsList}>
                {REASONS.map((r) => {
                  const isSelected = selectedReason === r.id
                  return (
                    <TouchableOpacity
                      key={r.id}
                      style={[styles.reasonItem, isSelected && styles.reasonItemSelected]}
                      onPress={() => setSelectedReason(r.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.radio, isSelected && styles.radioSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                        {t(`reports.reasons.${r.id.toLowerCase()}`, r.label)}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>

              <Text style={styles.label}>{t('messaging.report.details_label', 'Détails ou précisions (optionnel)')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('messaging.report.details_placeholder', 'Expliquez ce qui s\'est passé...')}
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
                  <Text style={styles.cancelBtnText}>{t('common.cancel', 'Annuler')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size='small' color={Colors.white} />
                  ) : (
                    <Text style={styles.submitBtnText}>{t('messaging.report.submit', 'Confirmer le signalement')}</Text>
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
    color: Colors.destructive,
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
    paddingVertical: Spacing[2.5],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: Spacing[3],
  },
  reasonItemSelected: {
    borderColor: Colors.destructive,
    backgroundColor: '#fef2f2',
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
    borderColor: Colors.destructive,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.destructive,
  },
  reasonText: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    flex: 1,
  },
  reasonTextSelected: {
    fontWeight: FontWeight.semibold,
    color: Colors.destructive,
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
    backgroundColor: Colors.destructive,
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
