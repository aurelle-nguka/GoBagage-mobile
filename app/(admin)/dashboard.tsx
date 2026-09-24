import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/auth.store'
import { getKycQueue, getAdminStats } from '../../features/admin/api/admin.api'
import { notificationService } from '../../shared/services/notification.service'
import { AdminDashboardScreen } from '../../features/admin/screens/AdminDashboardScreen'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [pendingKycCount, setPendingKycCount] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const kycData = await getKycQueue({ status: 'PENDING', size: 1 })
      setPendingKycCount(kycData.totalElements ?? 0)
    } catch (e) {
      console.error('[AdminDashboard] Failed to load KYC queue:', e)
      setPendingKycCount(0)
    }

    try {
      const stats = await getAdminStats()
      setTotalUsers(stats.totalUsers ?? 0)
    } catch (e) {
      console.error('[AdminDashboard] Failed to load admin stats:', e)
      setTotalUsers(0)
    }

    try {
      const unreadCount = await notificationService.getUnreadCount()
      setUnreadNotifications(unreadCount ?? 0)
    } catch (e) {
      console.error('[AdminDashboard] Failed to load unread notifications count:', e)
      setUnreadNotifications(0)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Admin'

  return (
    <AdminDashboardScreen
      adminName={adminName}
      pendingKycCount={pendingKycCount}
      totalUsers={totalUsers}
      unreadNotifications={unreadNotifications}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onPressNotifications={() => router.push('/(modals)/notifications')}
      onGoToKycQueue={() => router.push('/(admin)/kyc-queue')}
      onGoToCorridors={() => router.push('/(admin)/corridors')}
      onGoToDisputes={() => router.push('/(admin)/disputes')}
      onLogout={async () => {
        await logout()
        router.replace('/(auth)/onboarding')
      }}
    />
  )
}
