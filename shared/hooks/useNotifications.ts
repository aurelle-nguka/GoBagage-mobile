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

  // Refresh whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications(true)
    }, [fetchNotifications])
  )

  // Background polling every 15s to keep notifications fresh
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