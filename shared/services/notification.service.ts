import * as Device from 'expo-device'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import { Platform } from 'react-native'
import apiClient from './api.client'

export const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient

// `expo-notifications` lève une exception rien qu'en étant importé sous Expo Go
// (Android, depuis le SDK 53) — un `import` statique s'exécute toujours, peu importe
// une condition après coup. On ne le require() que si on n'est pas dans Expo Go.
const Notifications: typeof import('expo-notifications') | null = isExpoGo
  ? null
  : require('expo-notifications')

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge:  true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Notifications) {
    console.log('[FCM] Skipped — push notifications require a development build since SDK 53 (not supported in Expo Go).')
    return null
  }

  if (!Device.isDevice) {
    console.log('[FCM] Must use physical device for notifications')
    return null
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('[FCM] Permission not granted')
    return null
  }

  const tokenData = await Notifications.getExpoPushTokenAsync()
  const token = tokenData.data
  console.log('[FCM] Expo push token:', token)

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Go Bagage',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00C853',
      sound: 'default',
    })
  }

  return token
}

export async function sendTokenToBackend(token: string): Promise<void> {
  try {
    await apiClient.post('/notifications/tokens', {
      token,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    })
    console.log('[FCM] Token registered on backend')
  } catch (err) {
    console.log('[FCM] Failed to register token:', err)
  }
}

export async function unregisterToken(token: string): Promise<void> {
  try {
    await apiClient.delete(`/notifications/tokens/${token}`)
    console.log('[FCM] Token unregistered')
  } catch (err) {
    console.log('[FCM] Failed to unregister token:', err)
  }
}

import { useAuthStore } from '../../store/auth.store'

export function handleNotificationNavigation(data: any, router: any) {
  const { type, bookingId, tripId, conversationId, userId, disputeId } = data ?? {}
  const currentUser = useAuthStore.getState().user
  const isAdmin = currentUser?.roles?.includes('ADMIN')

  if (isAdmin) {
    switch (type) {
      case 'NEW_USER_REGISTERED':
      case 'USER_REGISTERED':
      case 'ACCOUNT_SUSPENDED':
      case 'ACCOUNT_REACTIVATED':
        if (userId) {
          router.push(`/(admin)/users/${userId}`)
        } else {
          router.push('/(admin)/users')
        }
        break
      case 'KYC_SUBMITTED':
        router.push('/(admin)/kyc-queue')
        break
      case 'DISPUTE':
      case 'DISPUTE_OPENED':
      case 'REPORT_FILED':
        if (disputeId) {
          router.push(`/(admin)/disputes/${disputeId}`)
        } else {
          router.push('/(admin)/disputes')
        }
        break
      default:
        router.push('/(admin)/dashboard')
        break
    }
    return
  }

  // Regular user (Sender / Traveler)
  switch (type) {
    case 'BOOKING_CREATED':
    case 'BOOKING_ACCEPTED':
    case 'BOOKING_REJECTED':
    case 'BOOKING_CONFIRMED':
    case 'BOOKING_CANCELLED':
    case 'PARCEL_PICKED_UP':
    case 'PARCEL_IN_TRANSIT':
    case 'PARCEL_DELIVERED':
    case 'PAYMENT_RELEASED':
    case 'PAYMENT_REFUNDED':
    case 'DELIVERY_REMINDER':
      if (bookingId) router.push(`/(modals)/tracking/${bookingId}`)
      break
    case 'NEW_BOOKING_REQUEST':
      if (tripId) router.push(`/(modals)/trip-requests/${tripId}`)
      break
    case 'NEW_MESSAGE':
      if (conversationId) router.push(`/(modals)/chat/${conversationId}`)
      break
    case 'KYC_APPROVED':
    case 'KYC_REJECTED':
      router.push('/(tabs)/profile')
      break
    default:
      router.push('/(tabs)/')
  }
}

export interface NotificationDTO {
  id: number
  type: string
  title: string
  body: string
  read: boolean
  createdAt: string
  data?: Record<string, string> | null
}

export interface UnreadCountResponse {
  count: number
}

export const notificationService = {
  async getNotifications(): Promise<NotificationDTO[]> {
    const response = await apiClient.get<NotificationDTO[]>('/notifications')
    return response.data
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count')
    return response.data?.count ?? 0
  },

  async markAsRead(id: number): Promise<NotificationDTO> {
    const response = await apiClient.patch<NotificationDTO>(`/notifications/${id}/read`)
    return response.data
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all')
  },
}