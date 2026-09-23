import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  ArrowLeft,
  Bell,
  Package,
  CheckCircle,
  XCircle,
  Plane,
  Wallet,
  MessageCircle,
  AlertCircle,
  Scale,
  Clock,
  UserPlus,
  ShieldCheck,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { useState, useEffect } from 'react'
import { useNotifications } from '../../../shared/hooks/useNotifications'
import { useUnreadNotifications } from '../hooks/useUnreadNotifications'
import type { NotificationItem } from '../../../shared/services/notifications.api'
import {
  DisputeDetailModal,
  DisputeDetailData,
} from '../../messaging/components/DisputeDetailModal'

interface NotificationsScreenProps {
  onBack: () => void
  onNavigate: (data: any) => void
}

function getIcon(type: string) {
  switch (type) {
    case 'NEW_USER_REGISTERED':
      return <UserPlus size={20} color={Colors.primary} />
    case 'KYC_SUBMITTED':
      return <ShieldCheck size={20} color={Colors.warning} />
    case 'BOOKING_CREATED':
    case 'NEW_BOOKING_REQUEST':
      return <Package size={20} color={Colors.primary} />
    case 'BOOKING_ACCEPTED':
    case 'BOOKING_CONFIRMED':
    case 'KYC_APPROVED':
      return <CheckCircle size={20} color={Colors.primary} />
    case 'BOOKING_REJECTED':
    case 'BOOKING_CANCELLED':
    case 'KYC_REJECTED':
      return <XCircle size={20} color={Colors.destructive} />
    case 'PARCEL_PICKED_UP':
    case 'PARCEL_IN_TRANSIT':
    case 'PARCEL_DELIVERED':
      return <Plane size={20} color={Colors.secondary} />
    case 'PAYMENT_RELEASED':
    case 'PAYMENT_REFUNDED':
      return <Wallet size={20} color={Colors.primary} />
    case 'NEW_MESSAGE':
      return <MessageCircle size={20} color={Colors.primary} />
    case 'DISPUTE':
    case 'DISPUTE_OPENED':
    case 'REPORT_FILED':
      return <Scale size={20} color={Colors.destructive} />
    case 'DELIVERY_REMINDER':
      return <Clock size={20} color={Colors.mutedForeground} />
    default:
      return <Bell size={20} color={Colors.mutedForeground} />
  }
}

export function NotificationsScreen({
  onBack,
  onNavigate,
}: NotificationsScreenProps) {
  const { t, i18n } = useTranslation()
  const { notifications, readOne, readAll } = useNotifications()
  const { clearBadge } = useUnreadNotifications()

  const [selectedDispute, setSelectedDispute] = useState<DisputeDetailData | null>(null)
  const [showDisputeModal, setShowDisputeModal] = useState(false)

  useEffect(() => {
    readAll()
    clearBadge()
  }, [])

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))

  const handlePress = (item: NotificationItem) => {
    if (!item.read) readOne(item.id)

    let data: Record<string, any> = {}
    if (typeof item.data === 'string') {
      try {
        data = JSON.parse(item.data)
      } catch {
        data = {}
      }
    } else if (item.data && typeof item.data === 'object') {
      data = item.data
    }

    const type = (item.type || '').toUpperCase()
    const bookingId =
      data.bookingId ||
      data.booking_id ||
      data.booking ||
      data.conversationId ||
      data.conversation_id ||
      (item as any).bookingId

    if (
      type === 'DISPUTE' ||
      type === 'DISPUTE_OPENED' ||
      type === 'REPORT_FILED' ||
      data.disputeId ||
      data.reason
    ) {
      setSelectedDispute({
        id: item.id,
        disputeId: data.disputeId || item.id,
        bookingId: bookingId,
        reason: data.reason,
        description: data.description || data.comment,
        status: data.status || 'OPEN',
        createdAt: item.createdAt,
        title: item.title,
        body: item.body,
      })
      setShowDisputeModal(true)
      return
    }

    onNavigate({ ...data, bookingId, type: item.type })
  }

  const getLocalizedContent = (item: NotificationItem) => {
    switch (item.type) {
      case 'NEW_USER_REGISTERED': {
        const name = item.data?.name || ''
        const email = item.data?.email || ''
        return {
          title: t('notifications.types.NEW_USER_REGISTERED.title', item.title || 'New User Registered'),
          body: name && email
            ? t('notifications.types.NEW_USER_REGISTERED.body', {
                name,
                email,
                defaultValue: `${name} (${email}) just created an account.`,
              })
            : item.body,
        }
      }
      case 'KYC_SUBMITTED': {
        const name = item.data?.name || ''
        const docType = item.data?.documentType || ''
        return {
          title: t('notifications.types.KYC_SUBMITTED.title', item.title || 'KYC Document Submitted'),
          body: name
            ? t('notifications.types.KYC_SUBMITTED.body', {
                name,
                docType,
                defaultValue: `${name} submitted a document (${docType}) for verification.`,
              })
            : item.body,
        }
      }
      case 'DISPUTE_OPENED': {
        const disputeId = item.data?.disputeId || ''
        const bookingId = item.data?.bookingId || ''
        const rawReason = item.data?.reason || ''
        const translatedReason = rawReason
          ? t(`disputes.reasons.${rawReason}`, rawReason.replace(/_/g, ' '))
          : ''
        return {
          title: t('notifications.types.DISPUTE_OPENED.title', item.title || 'New Dispute Opened'),
          body: disputeId
            ? t('notifications.types.DISPUTE_OPENED.body', {
                disputeId,
                bookingId,
                reason: translatedReason,
                defaultValue: `Dispute #${disputeId} opened for booking #${bookingId}.${translatedReason ? ` Reason: ${translatedReason}` : ''}`,
              })
            : item.body,
        }
      }
      case 'DISPUTE': {
        const bookingId = item.data?.bookingId || ''
        return {
          title: t('notifications.types.DISPUTE.title', item.title || 'Dispute Opened'),
          body: bookingId
            ? t('notifications.types.DISPUTE.body', {
                bookingId,
                defaultValue: `A dispute has been opened for booking #${bookingId}.`,
              })
            : item.body,
        }
      }
      case 'REPORT_FILED': {
        const reportId = item.data?.reportId || ''
        const targetType = item.data?.targetType || ''
        const reason = item.data?.reason || ''
        return {
          title: t('notifications.types.REPORT_FILED.title', item.title || 'New Report Filed'),
          body: reportId
            ? t('notifications.types.REPORT_FILED.body', {
                reportId,
                targetType,
                reason,
                defaultValue: `Report #${reportId} submitted (${targetType}). Reason: ${reason}`,
              })
            : item.body,
        }
      }
      case 'KYC_APPROVED':
        return {
          title: t('notifications.types.KYC_APPROVED.title', item.title || 'KYC Approved'),
          body: t('notifications.types.KYC_APPROVED.body', item.body || 'Your identity verification was approved!'),
        }
      case 'KYC_REJECTED':
        return {
          title: t('notifications.types.KYC_REJECTED.title', item.title || 'KYC Rejected'),
          body: item.data?.reason
            ? t('notifications.types.KYC_REJECTED.body', {
                reason: item.data.reason,
                defaultValue: `Your KYC was rejected: ${item.data.reason}`,
              })
            : item.body,
        }
      case 'BOOKING_CREATED':
        return {
          title: t('notifications.types.BOOKING_CREATED.title', item.title || 'Booking Created'),
          body: item.data?.bookingId
            ? t('notifications.types.BOOKING_CREATED.body', {
                bookingId: item.data.bookingId,
                defaultValue: `Booking #${item.data.bookingId} created.`,
              })
            : item.body,
        }
      case 'BOOKING_ACCEPTED':
        return {
          title: t('notifications.types.BOOKING_ACCEPTED.title', item.title || 'Booking Accepted'),
          body: item.data?.bookingId
            ? t('notifications.types.BOOKING_ACCEPTED.body', {
                bookingId: item.data.bookingId,
                defaultValue: `Booking #${item.data.bookingId} accepted.`,
              })
            : item.body,
        }
      case 'BOOKING_REJECTED':
        return {
          title: t('notifications.types.BOOKING_REJECTED.title', item.title || 'Booking Rejected'),
          body: item.data?.bookingId
            ? t('notifications.types.BOOKING_REJECTED.body', {
                bookingId: item.data.bookingId,
                reason: item.data.reason || '',
                defaultValue: `Booking #${item.data.bookingId} rejected: ${item.data.reason || ''}`,
              })
            : item.body,
        }
      case 'BOOKING_CONFIRMED':
        return {
          title: t('notifications.types.BOOKING_CONFIRMED.title', item.title || 'Booking Confirmed'),
          body: item.data?.bookingId
            ? t('notifications.types.BOOKING_CONFIRMED.body', {
                bookingId: item.data.bookingId,
                defaultValue: `Booking #${item.data.bookingId} confirmed.`,
              })
            : item.body,
        }
      case 'BOOKING_CANCELLED':
        return {
          title: t('notifications.types.BOOKING_CANCELLED.title', item.title || 'Booking Cancelled'),
          body: item.data?.bookingId
            ? t('notifications.types.BOOKING_CANCELLED.body', {
                bookingId: item.data.bookingId,
                defaultValue: `Booking #${item.data.bookingId} cancelled.`,
              })
            : item.body,
        }
      case 'PARCEL_PICKED_UP':
        return {
          title: t('notifications.types.PARCEL_PICKED_UP.title', item.title || 'Parcel Picked Up'),
          body: t('notifications.types.PARCEL_PICKED_UP.body', item.body || 'Your parcel has been picked up.'),
        }
      case 'PARCEL_IN_TRANSIT':
        return {
          title: t('notifications.types.PARCEL_IN_TRANSIT.title', item.title || 'Parcel In Transit'),
          body: t('notifications.types.PARCEL_IN_TRANSIT.body', item.body || 'Your parcel is in transit.'),
        }
      case 'PARCEL_DELIVERED':
        return {
          title: t('notifications.types.PARCEL_DELIVERED.title', item.title || 'Parcel Delivered'),
          body: t('notifications.types.PARCEL_DELIVERED.body', item.body || 'Your parcel has been delivered.'),
        }
      case 'PAYMENT_RELEASED':
        return {
          title: t('notifications.types.PAYMENT_RELEASED.title', item.title || 'Payment Released'),
          body: t('notifications.types.PAYMENT_RELEASED.body', item.body || 'Payment has been released.'),
        }
      case 'PAYMENT_REFUNDED':
        return {
          title: t('notifications.types.PAYMENT_REFUNDED.title', item.title || 'Payment Refunded'),
          body: t('notifications.types.PAYMENT_REFUNDED.body', item.body || 'Payment has been refunded.'),
        }
      case 'NEW_MESSAGE':
        return {
          title: t('notifications.types.NEW_MESSAGE.title', item.title || 'New Message'),
          body: item.data?.senderName
            ? t('notifications.types.NEW_MESSAGE.body', {
                senderName: item.data.senderName,
                defaultValue: `You have a new message from ${item.data.senderName}`,
              })
            : item.body,
        }
      case 'NEW_BOOKING_REQUEST':
        return {
          title: t('notifications.types.NEW_BOOKING_REQUEST.title', item.title || 'New Booking Request'),
          body: t('notifications.types.NEW_BOOKING_REQUEST.body', item.body || 'You received a new booking request.'),
        }
      case 'DELIVERY_REMINDER':
        return {
          title: t('notifications.types.DELIVERY_REMINDER.title', item.title || 'Delivery Reminder'),
          body: item.data?.bookingId
            ? t('notifications.types.DELIVERY_REMINDER.body', {
                bookingId: item.data.bookingId,
                defaultValue: `Don't forget to deliver booking #${item.data.bookingId}`,
              })
            : item.body,
        }
      case 'ACCOUNT_SUSPENDED': {
        const reason = item.data?.reason || ''
        return {
          title: t('notifications.types.ACCOUNT_SUSPENDED.title', item.title || 'Account Suspended'),
          body: reason
            ? t('notifications.types.ACCOUNT_SUSPENDED.body_with_reason', {
                reason,
                defaultValue: `Your account has been suspended: ${reason}`,
              })
            : t('notifications.types.ACCOUNT_SUSPENDED.body', item.body || 'Your account has been temporarily suspended.'),
        }
      }
      case 'ACCOUNT_REACTIVATED':
        return {
          title: t('notifications.types.ACCOUNT_REACTIVATED.title', item.title || 'Account Reactivated'),
          body: t('notifications.types.ACCOUNT_REACTIVATED.body', item.body || 'Your account has been reactivated.'),
        }
      case 'PAYMENT_FAILED': {
        const bookingId = item.data?.bookingId || ''
        return {
          title: t('notifications.types.PAYMENT_FAILED.title', item.title || 'Payment Failed'),
          body: bookingId
            ? t('notifications.types.PAYMENT_FAILED.body', {
                bookingId,
                defaultValue: `Your payment for booking #${bookingId} failed. Please try again.`,
              })
            : item.body,
        }
      }
      default:
        return {
          title: item.title,
          body: item.body,
        }
    }
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
        <View>
          <Text style={styles.headerTitle}>
            {t('notifications.title', 'Notifications')}
          </Text>
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const localized = getLocalizedContent(item)
          return (
            <TouchableOpacity
              style={[styles.card, item.read && styles.cardRead]}
              onPress={() => handlePress(item)}
              activeOpacity={0.85}
            >
              <View style={styles.iconBox}>{getIcon(item.type)}</View>
              <View style={styles.content}>
                <Text style={styles.title}>{localized.title}</Text>
                <Text style={styles.body} numberOfLines={2}>
                  {localized.body}
                </Text>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={48} color='#d1d5db' />
            <Text style={styles.emptyText}>
              {t('notifications.empty', 'No notifications yet')}
            </Text>
          </View>
        }
      />

      <DisputeDetailModal
        visible={showDisputeModal}
        dispute={selectedDispute}
        onClose={() => setShowDisputeModal(false)}
        onOpenChat={(bookingId) => {
          onNavigate({ bookingId, type: 'NEW_MESSAGE' })
        }}
      />
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
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  listContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRead: { opacity: 0.7 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  body: { fontSize: FontSize.sm, color: Colors.mutedForeground, marginTop: 2 },
  date: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[12],
    gap: Spacing[3],
  },
  emptyText: { color: '#9ca3af', fontSize: FontSize.base },
})
