import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  X,
  Bell,
  CheckCheck,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Package,
  CreditCard,
  MessageSquare,
  Scale,
  Plane,
  Clock,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import {
  notificationService,
  NotificationDTO,
} from '../../shared/services/notification.service'
import {
  DisputeDetailModal,
  DisputeDetailData,
} from '../../features/messaging/components/DisputeDetailModal'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../theme'

export default function NotificationsModal() {
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const [notifications, setNotifications] = useState<NotificationDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Dispute modal state
  const [selectedDispute, setSelectedDispute] = useState<DisputeDetailData | null>(null)
  const [showDisputeModal, setShowDisputeModal] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (e) {
      console.error('[Notifications] Failed to load:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNotifications()
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
    } catch (e) {
      console.error('[Notifications] Failed to mark as read:', e)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (e) {
      console.error('[Notifications] Failed to mark all as read:', e)
    }
  }

  const handleItemPress = (item: NotificationDTO) => {
    if (!item.read) {
      handleMarkAsRead(item.id)
    }

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

    // 1. Litiges : ouvrir le pop-up de détail
    if (
      type === 'DISPUTE' ||
      type === 'DISPUTE_OPENED' ||
      type === 'REPORT_FILED' ||
      data.disputeId ||
      data.reason ||
      data.disputeReason ||
      data.dispute_reason
    ) {
      let extractedReason =
        data.reason ||
        data.disputeReason ||
        data.dispute_reason ||
        data.motif ||
        data.category ||
        ''

      let extractedStatus =
        data.status ||
        data.disputeStatus ||
        data.dispute_status ||
        'OPEN'

      let extractedDescription =
        data.description ||
        data.comment ||
        data.details ||
        data.message ||
        item.body ||
        ''

      if (!extractedReason && item.body) {
        if (/endommag|damage/i.test(item.body)) extractedReason = 'PACKAGE_DAMAGED'
        else if (/perdu|non re[cç]u|lost/i.test(item.body)) extractedReason = 'PACKAGE_LOST'
        else if (/retard|delay/i.test(item.body)) extractedReason = 'DELIVERY_DELAY'
        else if (/non[- ]conforme|conform|compliant/i.test(item.body)) extractedReason = 'NON_COMPLIANT'
      }

      setSelectedDispute({
        id: item.id,
        disputeId: data.disputeId || item.id,
        bookingId: bookingId,
        reason: extractedReason,
        description: extractedDescription,
        status: extractedStatus,
        createdAt: item.createdAt,
        title: item.title,
        body: item.body,
      })
      setShowDisputeModal(true)
      return
    }

    // 2. Messages : ouvrir le chat de la réservation ou la liste des conversations
    if (
      type === 'NEW_MESSAGE' ||
      type === 'MESSAGE_RECEIVED' ||
      type === 'MESSAGE' ||
      type.includes('MESSAGE') ||
      type.includes('CHAT')
    ) {
      if (bookingId) {
        router.push(`/(modals)/chat/${bookingId}`)
      } else {
        router.push('/(modals)/conversations')
      }
      return
    }

    // 3. Suivi de réservation / Colis
    if (
      type === 'BOOKING_CREATED' ||
      type === 'BOOKING_ACCEPTED' ||
      type === 'BOOKING_CONFIRMED' ||
      type === 'BOOKING_PICKED_UP' ||
      type === 'PARCEL_PICKED_UP' ||
      type === 'PARCEL_IN_TRANSIT' ||
      type === 'PARCEL_DELIVERED'
    ) {
      if (bookingId) {
        router.push(`/(modals)/tracking/${bookingId}`)
      } else {
        router.push('/(modals)/activity')
      }
      return
    }

    // 4. Demandes pour le voyageur
    if (type === 'NEW_BOOKING_REQUEST') {
      if (data.tripId) {
        router.push(`/(modals)/trip-requests/${data.tripId}`)
      } else if (bookingId) {
        router.push(`/(modals)/traveler-booking/${bookingId}`)
      }
      return
    }

    // 5. KYC
    if (
      type === 'KYC_SUBMITTED' ||
      type === 'KYC_APPROVED' ||
      type === 'KYC_REJECTED' ||
      type === 'KYC_VERIFIED'
    ) {
      router.push('/(auth)/kyc')
      return
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_USER_REGISTERED':
        return <UserPlus size={20} color={Colors.primary} />
      case 'KYC_SUBMITTED':
      case 'KYC_VERIFIED':
      case 'KYC_APPROVED':
        return <ShieldCheck size={20} color={Colors.warning} />
      case 'KYC_REJECTED':
        return <ShieldCheck size={20} color={Colors.destructive} />
      case 'DISPUTE':
      case 'DISPUTE_OPENED':
      case 'REPORT_FILED':
        return <Scale size={20} color={Colors.destructive} />
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_RELEASED':
        return <CreditCard size={20} color='#10B981' />
      case 'NEW_MESSAGE':
      case 'MESSAGE_RECEIVED':
        return <MessageSquare size={20} color={Colors.secondary} />
      case 'PARCEL_PICKED_UP':
      case 'PARCEL_IN_TRANSIT':
      case 'PARCEL_DELIVERED':
        return <Plane size={20} color={Colors.secondary} />
      case 'DELIVERY_REMINDER':
        return <Clock size={20} color={Colors.mutedForeground} />
      default:
        return <Package size={20} color={Colors.primary} />
    }
  }

  const renderItem = ({ item }: { item: NotificationDTO }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconCircle}>{getNotificationIcon(item.type)}</View>
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !item.read && styles.unreadText]}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleDateString(i18n.language, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={22} color={Colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('notifications.title', 'Notifications')}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <CheckCheck size={18} color={Colors.primary} />
            <Text style={styles.markAllText}>
              {t('notifications.mark_all_read', 'Tout marquer comme lu')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Bell size={48} color='#d1d5db' />
          <Text style={styles.emptyTitle}>
            {t('notifications.empty_title', 'Aucune notification')}
          </Text>
          <Text style={styles.emptySubtitle}>
            {t('notifications.empty_subtitle', 'Vous recevrez ici les mises à jour importantes.')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}

      {/* Pop-up de détail du litige */}
      <DisputeDetailModal
        visible={showDisputeModal}
        dispute={selectedDispute}
        onClose={() => setShowDisputeModal(false)}
        onOpenChat={(bookingId) => {
          router.push(`/(modals)/chat/${bookingId}`)
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: Colors.white,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerBadge: {
    backgroundColor: Colors.destructive,
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  headerBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: FontWeight.bold,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
  },
  markAllText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  listContent: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  notificationCard: {
    flexDirection: 'row',
    padding: Spacing[4],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    gap: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.foreground,
    flex: 1,
  },
  unreadText: {
    fontWeight: FontWeight.bold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  body: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: '#9ca3af',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[8],
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginTop: Spacing[4],
    marginBottom: Spacing[1],
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    textAlign: 'center',
  },
})
