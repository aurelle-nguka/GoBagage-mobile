import apiClient from './api.client'

export interface NotificationItem {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  data: Record<string, string>
  createdAt: string
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await apiClient.get('/notifications')
  return Array.isArray(response.data) ? response.data : response.data?.content ?? []
}

export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get('/notifications/unread-count')
  return response.data?.count ?? 0
}

export async function markAsRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`)
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all')
}