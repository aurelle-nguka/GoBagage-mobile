import { useState, useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { isExpoGo } from '../../../shared/services/notification.service'

// require() dynamique : voir shared/services/notification.service.ts pour le pourquoi
// (expo-notifications lève une exception rien qu'à l'import sous Expo Go, SDK 53+).
const Notifications: typeof import('expo-notifications') | null = isExpoGo
  ? null
  : require('expo-notifications')

export function useUnreadNotifications() {
  const [count, setCount] = useState(0)

  const load = useCallback(async () => {
    if (!Notifications) return
    try {
      const badgeCount = await Notifications.getBadgeCountAsync()
      setCount(badgeCount)
    } catch {
      setCount(0)
    }
  }, [])

  useFocusEffect(useCallback(() => { load() }, [load]))

  const clearBadge = async () => {
    if (Notifications) {
      try {
        await Notifications.setBadgeCountAsync(0)
      } catch {
        // Badge non disponible — sans conséquence.
      }
    }
    setCount(0)
  }

  return { count, clearBadge, refresh: load }
}