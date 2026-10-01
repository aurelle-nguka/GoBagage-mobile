import { useCallback, useEffect } from 'react'
import { useFocusEffect } from 'expo-router'
import { useNotificationStore } from '../../store/notification.store'

export function useNotifications() {
  const {
    notifications,
    unreadCount,
    loading,
    isInitialized,
    fetchNotifications,
    fetchUnreadCount,
    readOne,
    readAll,
    clearBadge,
  } = useNotificationStore()

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(true)
    }, [fetchNotifications])
  )

  useEffect(() => {
    if (!isInitialized) {
      fetchNotifications()
    }
    const interval = setInterval(() => {
      fetchNotifications(true)
    }, 15000)
    return () => clearInterval(interval)
  }, [fetchNotifications, isInitialized])

  return {
    notifications,
    unreadCount,
    loading: loading && !isInitialized,
    refresh: () => fetchNotifications(false),
    readOne,
    readAll,
    clearBadge,
  }
}