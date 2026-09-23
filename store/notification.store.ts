/**
 * Go Bagage — Notification Store (Zustand)
 * Centralise l'état des notifications et du badge pour toute l'application.
 * Fournit une mise à jour instantanée (optimiste), un cache en mémoire,
 * et une synchronisation automatique en temps réel.
 */

import { create } from 'zustand'
import {
  getNotifications,
  getUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  type NotificationItem,
} from '../shared/services/notifications.api'

interface NotificationState {
  notifications: NotificationItem[]
  unreadCount: number
  loading: boolean
  isInitialized: boolean

  fetchNotifications: (silent?: boolean) => Promise<void>
  fetchUnreadCount: () => Promise<void>
  readOne: (id: string) => Promise<void>
  readAll: () => Promise<void>
  clearBadge: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  isInitialized: false,

  fetchNotifications: async (silent = false) => {
    if (!silent && !get().isInitialized) {
      set({ loading: true })
    }
    try {
      const items = await getNotifications()
      const unread = items.filter((n) => !n.read).length
      set({
        notifications: items,
        unreadCount: unread,
        loading: false,
        isInitialized: true,
      })
    } catch {
      set({ loading: false })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const count = await getUnreadCount()
      set({ unreadCount: count })
    } catch {}
  },

  readOne: async (id: string) => {
    // Mise à jour optimiste instantanée de l'UI
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
    try {
      await apiMarkAsRead(id)
    } catch {}
  },

  readAll: async () => {
    // Mise à jour optimiste instantanée de l'UI
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
    try {
      await apiMarkAllAsRead()
    } catch {}
  },

  clearBadge: () => {
    set({ unreadCount: 0 })
  },
}))
