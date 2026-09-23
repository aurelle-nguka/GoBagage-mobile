/**
 * Go Bagage — ContactProfileModal
 * Fiche d'informations du contact (Style WhatsApp / GoBagage) : profil, statut KYC, détails du trajet et actions.
 */

import React from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  X,
  Phone,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Calendar,
  Star,
  Lock,
  Package,
  ArrowRight,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'
import { toAbsoluteFileUrl } from '../../../shared/utils/url.utils'
import { ConversationParticipant, CorridorSummary } from '../types/message.types'

interface ContactProfileModalProps {
  visible: boolean
  onClose: () => void
  participant?: ConversationParticipant
  corridor?: CorridorSummary | null
  departureDate?: string
  bookingId: string
  onDispute: () => void
  onReport: () => void
}

export function ContactProfileModal({
  visible,
  onClose,
  participant,
  corridor,
  departureDate,
  bookingId,
  onDispute,
  onReport,
}: ContactProfileModalProps) {
  const insets = useSafeAreaInsets()
  const { t, i18n } = useTranslation()

  if (!visible) return null

  const initials = participant
    ? `${participant.firstName?.[0] ?? ''}${participant.lastNameInitial ?? ''}`.toUpperCase()
    : 'GB'
  const fullName = participant
    ? `${participant.firstName} ${participant.lastNameInitial ? `${participant.lastNameInitial}.` : ''}`.trim()
    : t('messaging.contact.unknown', 'Utilisateur')

  const formattedDate = departureDate
    ? new Intl.DateTimeFormat(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(departureDate))
    : null

  const handleCall = () => {
    if (participant?.phoneNumber) {
      Linking.openURL(`tel:${participant.phoneNumber}`)
    } else {
      Alert.alert(
        t('messaging.call.title', 'Numéro masqué'),
        t(
          'messaging.call.unavailable',
          'Le numéro de téléphone est automatiquement protégé avant la confirmation définitive de la réservation.',
        ),
      )
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, Spacing[4]) }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={22} color={Colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('messaging.contact.title', 'Infos du contact')}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, Spacing[6]) + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Section Profil Principal */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              {participant?.profilePhotoUrl ? (
                <Image
                  source={{ uri: toAbsoluteFileUrl(participant.profilePhotoUrl) }}
                  style={styles.avatarLargeImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarLargeText}>{initials}</Text>
              )}
            </View>

            <Text style={styles.userName}>{fullName}</Text>

            {participant?.kycVerified ? (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={14} color="#16a34a" />
                <Text style={styles.verifiedText}>
                  {t('messaging.contact.identity_verified', 'Identité vérifiée (KYC)')}
                </Text>
              </View>
            ) : (
              <View style={[styles.verifiedBadge, { backgroundColor: '#fef3c7', borderColor: '#fde68a' }]}>
                <ShieldAlert size={14} color="#d97706" />
                <Text style={[styles.verifiedText, { color: '#b45309' }]}>
                  {t('messaging.contact.identity_pending', 'Identité non certifiée')}
                </Text>
              </View>
            )}

            {typeof participant?.averageRating === 'number' && participant.averageRating > 0 && (
              <View style={styles.ratingRow}>
                <Star size={16} color="#eab308" fill="#eab308" />
                <Text style={styles.ratingText}>
                  {participant.averageRating.toFixed(1)} / 5.0
                </Text>
              </View>
            )}

            {/* Bouton Appel */}
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCall}
              activeOpacity={0.85}
            >
              <Phone size={18} color={Colors.white} />
              <Text style={styles.callButtonText}>
                {t('messaging.contact.call_action', 'Appeler le contact')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section Réservation & Trajet */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              {t('messaging.contact.trip_section', 'Trajet associé')}
            </Text>

            {corridor ? (
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <MapPin size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>
                    {t('messaging.contact.route', 'Itinéraire')}
                  </Text>
                  <View style={{ marginTop: 2 }}>
                    <RouteLabel
                      from={(corridor.departureCity || '').replace(/\\n/g, '').replace(/\n/g, ' ').trim()}
                      to={(corridor.arrivalCity || '').replace(/\\n/g, '').replace(/\n/g, ' ').trim()}
                      size="sm"
                      fontWeight="bold"
                    />
                  </View>
                  {(corridor.departureCountry || corridor.arrivalCountry) && (
                    <View style={styles.countryRow}>
                      {corridor.departureCountry ? (
                        <Text style={styles.countrySubText}>
                          {corridor.departureCountry.replace(/\\n/g, '').replace(/\n/g, ' ').trim()}
                        </Text>
                      ) : null}
                      {corridor.departureCountry && corridor.arrivalCountry && (
                        <ArrowRight size={11} color={Colors.mutedForeground} strokeWidth={2} />
                      )}
                      {corridor.arrivalCountry ? (
                        <Text style={styles.countrySubText}>
                          {corridor.arrivalCountry.replace(/\\n/g, '').replace(/\n/g, ' ').trim()}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Package size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>
                    {t('messaging.contact.route', 'Itinéraire')}
                  </Text>
                  <Text style={styles.infoValue}>
                    {t('messaging.contact.booking_trip', 'Réservation en cours')}
                  </Text>
                </View>
              </View>
            )}

            {formattedDate && (
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Calendar size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>
                    {t('messaging.contact.departure_date', 'Date de départ')}
                  </Text>
                  <Text style={styles.infoValue}>{formattedDate}</Text>
                </View>
              </View>
            )}

            <View style={styles.bookingBadgeRow}>
              <Text style={styles.bookingBadgeText}>
                {t('messaging.contact.booking_ref', 'Réservation #')}{bookingId}
              </Text>
            </View>
          </View>

          {/* Section Sécurité & Confidentialité */}
          <View style={styles.sectionCard}>
            <View style={styles.securityHeader}>
              <Lock size={16} color={Colors.primary} />
              <Text style={styles.securityTitle}>
                {t('messaging.contact.security_title', 'Garantie & Sécurité GoBagage')}
              </Text>
            </View>
            <Text style={styles.securityDesc}>
              {t(
                'messaging.contact.security_desc',
                'Vos échanges et paiements sont sécurisés. Ne partagez jamais vos coordonnées bancaires en dehors de la plateforme.',
              )}
            </Text>
          </View>

          {/* Section Actions de Sécurité */}
          <View style={styles.dangerSection}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                onClose()
                onDispute()
              }}
              activeOpacity={0.7}
            >
              <AlertTriangle size={18} color={Colors.warning} />
              <Text style={styles.actionText}>
                {t('messaging.options.open_dispute', 'Déclarer un litige')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, { marginTop: Spacing[2] }]}
              onPress={() => {
                onClose()
                onReport()
              }}
              activeOpacity={0.7}
            >
              <ShieldAlert size={18} color={Colors.destructive} />
              <Text style={[styles.actionText, { color: Colors.destructive }]}>
                {t('messaging.options.report_user', "Signaler l'utilisateur")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  scrollContent: {
    padding: Spacing[4],
    gap: Spacing[4],
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
    overflow: 'hidden',
  },
  avatarLargeImage: {
    width: '100%',
    height: '100%',
  },
  avatarLargeText: {
    fontSize: 26,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing[2],
  },
  verifiedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: '#15803d',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing[4],
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    width: '100%',
  },
  callButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.lg,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },
  infoValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginTop: 1,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  countrySubText: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },
  bookingBadgeRow: {
    backgroundColor: '#f8fafc',
    padding: Spacing[3],
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  bookingBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    fontWeight: FontWeight.medium,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  securityTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  securityDesc: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    lineHeight: FontSize.xs * 1.5,
  },
  dangerSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[3],
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
    backgroundColor: '#f9fafb',
    borderRadius: Radius.xl,
  },
  actionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
})
