import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import {
  Scale,
  X,
  AlertTriangle,
  ShieldAlert,
  MessageCircle,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import apiClient from '../../../shared/services/api.client'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

export interface DisputeDetailData {
  id?: string | number
  disputeId?: string | number
  bookingId?: string | number
  reason?: string
  description?: string
  status?: string
  createdAt?: string
  resolvedAt?: string
  resolution?: string
  title?: string
  body?: string
}

interface DisputeDetailModalProps {
  visible: boolean
  dispute: DisputeDetailData | null
  onClose: () => void
  onOpenChat?: (bookingId: string | number) => void
}

const REASON_LABELS: Record<string, string> = {
  PACKAGE_DAMAGED: 'Colis endommagé',
  PACKAGE_LOST: 'Colis non reçu / perdu',
  DELIVERY_DELAY: 'Retard important de livraison',
  NON_COMPLIANT: 'Contenu non conforme à la déclaration',
  FRAUD: 'Fraude ou escroquerie',
  INAPPROPRIATE_CONTENT: 'Contenu inapproprié ou offensant',
  NO_SHOW: 'Absence au rendez-vous',
  DANGEROUS_ITEMS: 'Objets interdits ou dangereux',
  OTHER: 'Autre motif de litige',
  package_damaged: 'Colis endommagé',
  package_lost: 'Colis non reçu / perdu',
  delivery_delay: 'Retard important de livraison',
  non_compliant: 'Contenu non conforme à la déclaration',
  fraud: 'Fraude ou escroquerie',
  inappropriate_content: 'Contenu inapproprié ou offensant',
  no_show: 'Absence au rendez-vous',
  dangerous_items: 'Objets interdits ou dangereux',
  other: 'Autre motif de litige',
}

export function DisputeDetailModal({
  visible,
  dispute,
  onClose,
  onOpenChat,
}: DisputeDetailModalProps) {
  const { t, i18n } = useTranslation()
  const [liveData, setLiveData] = useState<DisputeDetailData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible || !dispute) {
      setLiveData(null)
      return
    }

    setLiveData(dispute)

    const fetchLiveDispute = async () => {
      const targetDisputeId = dispute.disputeId || dispute.id
      try {
        setLoading(true)
        let response = null

        if (targetDisputeId) {
          try {
            response = await apiClient.get(`/disputes/${targetDisputeId}`)
          } catch {}
        }

        if (!response?.data && dispute.bookingId) {
          try {
            response = await apiClient.get('/disputes', {
              params: { bookingId: dispute.bookingId },
            })
          } catch {}
        }

        if (response?.data) {
          const raw = Array.isArray(response.data)
            ? response.data[0]
            : response.data
          if (raw) {
            setLiveData((prev) => ({
              ...prev,
              disputeId: raw.id ?? prev?.disputeId,
              bookingId: raw.bookingId ?? prev?.bookingId,
              reason: raw.reason ?? prev?.reason,
              description: raw.description ?? prev?.description,
              status: raw.status ?? prev?.status,
              createdAt: raw.createdAt ?? prev?.createdAt,
              resolvedAt: raw.resolvedAt,
              resolution: raw.resolution,
            }))
          }
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }

    fetchLiveDispute()
  }, [visible, dispute])

  if (!dispute) return null

  const activeDispute = liveData || dispute
  const disputeId = activeDispute.disputeId || activeDispute.id
  const bookingId = activeDispute.bookingId

  const rawReason = (activeDispute.reason || '').trim()
  const reasonUpper = rawReason.toUpperCase()
  const reasonKey = rawReason.toLowerCase()

  const reasonLabel =
    REASON_LABELS[rawReason] ||
    REASON_LABELS[reasonUpper] ||
    REASON_LABELS[reasonKey] ||
    t(`disputes.reasons.${reasonKey}`, {
      defaultValue:
        rawReason && !/^[A-Z_]+$/.test(rawReason)
          ? rawReason
          : rawReason
            ? rawReason.replace(/_/g, ' ')
            : t('disputes.reasons.general', 'Litige déclaré'),
    })

  const rawDesc = (activeDispute.description || activeDispute.body || '').trim()
  const rawDescUpper = rawDesc.toUpperCase()

  const isDescEnumOrSame =
    !rawDesc ||
    rawDescUpper === rawReason.toUpperCase() ||
    rawDescUpper === reasonUpper ||
    rawDescUpper === (activeDispute.reason || '').toUpperCase() ||
    REASON_LABELS[rawDesc] !== undefined ||
    REASON_LABELS[rawDescUpper] !== undefined ||
    [
      'INAPPROPRIATE_CONTENT',
      'PACKAGE_DAMAGED',
      'PACKAGE_LOST',
      'DELIVERY_DELAY',
      'NON_COMPLIANT',
      'FRAUD',
      'NO_SHOW',
      'DANGEROUS_ITEMS',
      'OTHER',
    ].includes(rawDescUpper)

  const descriptionText = !isDescEnumOrSame
    ? rawDesc
    : t(
        'disputes.detail.no_description',
        'Aucun commentaire supplémentaire fourni.',
      )

  const statusUpper = (activeDispute.status || 'OPEN').toUpperCase()

  const getStatusConfig = (st: string) => {
    switch (st) {
      case 'RESOLVED':
      case 'CLOSED':
        return {
          label: t('disputes.detail.status_resolved', 'Résolu'),
          bg: '#d1fae5',
          color: '#047857',
          Icon: CheckCircle2,
          iconColor: '#10b981',
        }
      case 'REJECTED':
      case 'DISMISSED':
        return {
          label: t('disputes.detail.status_rejected', 'Rejeté'),
          bg: '#fee2e2',
          color: '#b91c1c',
          Icon: XCircle,
          iconColor: '#ef4444',
        }
      case 'CANCELLED':
        return {
          label: t('disputes.detail.status_cancelled', 'Annulé'),
          bg: '#f3f4f6',
          color: '#4b5563',
          Icon: XCircle,
          iconColor: '#6b7280',
        }
      case 'UNDER_REVIEW':
      case 'IN_REVIEW':
      case 'PENDING':
        return {
          label: t('disputes.detail.status_under_review', "En cours d'examen"),
          bg: '#fef3c7',
          color: '#b45309',
          Icon: AlertTriangle,
          iconColor: '#f59e0b',
        }
      case 'OPEN':
      default:
        return {
          label: t('disputes.detail.status_open', 'Litige ouvert'),
          bg: '#fff7ed',
          color: '#c2410c',
          Icon: AlertTriangle,
          iconColor: '#f97316',
        }
    }
  }

  const statusConfig = getStatusConfig(statusUpper)

  const formattedDate = activeDispute.createdAt
    ? new Intl.DateTimeFormat(i18n.language, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(activeDispute.createdAt))
    : ''

  const handleChatPress = () => {
    if (bookingId && onOpenChat) {
      onClose()
      onOpenChat(bookingId)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Scale size={20} color={Colors.destructive} />
              </View>
              <View>
                <Text style={styles.title}>
                  {t('disputes.detail.title', 'Détail du litige')}
                </Text>
                {disputeId ? (
                  <Text style={styles.disputeNumber}>
                    {t('disputes.detail.dispute_id', 'Dossier #{{id}}', {
                      id: disputeId,
                    })}
                  </Text>
                ) : null}
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <X size={20} color={Colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusConfig.bg },
                ]}
              >
                <statusConfig.Icon size={14} color={statusConfig.iconColor} />
                <Text
                  style={[styles.statusText, { color: statusConfig.color }]}
                >
                  {statusConfig.label}
                </Text>
              </View>

              {bookingId ? (
                <View style={styles.bookingBadge}>
                  <Text style={styles.bookingBadgeText}>
                    {t('disputes.detail.booking_ref', 'Réservation #{{id}}', {
                      id: bookingId,
                    })}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('disputes.detail.reason_label', 'Motif du litige')}
              </Text>
              <View style={styles.reasonBox}>
                <ShieldAlert size={18} color={Colors.destructive} />
                <Text style={styles.reasonText}>{reasonLabel}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t(
                  'disputes.detail.description_label',
                  'Explication & Détails',
                )}
              </Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>{descriptionText}</Text>
              </View>
            </View>

            {formattedDate ? (
              <View style={styles.dateRow}>
                <Calendar size={14} color='#9ca3af' />
                <Text style={styles.dateText}>
                  {t('disputes.detail.opened_on', 'Signalé le {{date}}', {
                    date: formattedDate,
                  })}
                </Text>
              </View>
            ) : null}

            <View style={styles.escrowNotice}>
              <Text style={styles.escrowTitle}>
                {t(
                  'disputes.detail.escrow_title',
                  '🔒 Fonds sécurisés sous séquestre',
                )}
              </Text>
              <Text style={styles.escrowText}>
                {t(
                  'disputes.detail.escrow_text',
                  "Les fonds associés à cette transaction restent bloqués. L'équipe de médiation GoBagage examine la réclamation et vous contactera si des pièces supplémentaires sont requises.",
                )}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {bookingId && onOpenChat ? (
              <TouchableOpacity
                style={styles.chatButton}
                onPress={handleChatPress}
                activeOpacity={0.85}
              >
                <MessageCircle size={18} color={Colors.primary} />
                <Text style={styles.chatButtonText}>
                  {t('disputes.detail.view_chat', 'Ouvrir la conversation')}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Text style={styles.closeButtonText}>
                {t('common.close', 'Fermer')}
              </Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: Spacing[3],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  disputeNumber: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    fontWeight: FontWeight.medium,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    maxHeight: 400,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[4],
    flexWrap: 'wrap',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusResolved: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  statusTextPending: {
    color: '#b45309',
  },
  statusTextResolved: {
    color: '#047857',
  },
  bookingBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  bookingBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  section: {
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.xl,
  },
  reasonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: '#991b1b',
    flex: 1,
  },
  descriptionBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: Radius.xl,
    padding: 14,
  },
  descriptionText: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing[4],
  },
  dateText: {
    fontSize: 11,
    color: '#9ca3af',
  },
  escrowNotice: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[2],
  },
  escrowTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  escrowText: {
    fontSize: 11,
    color: '#1e40af',
    lineHeight: 16,
  },
  footer: {
    gap: Spacing[2],
    marginTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: Spacing[3],
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    backgroundColor: '#e8faf0',
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
  },
  chatButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
  },
  closeButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
})
