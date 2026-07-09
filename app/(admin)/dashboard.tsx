import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/auth.store'
import { getKycQueue } from '../../features/admin/api/admin.api'
import { AdminDashboardScreen } from '../../features/admin/screens/AdminDashboardScreen'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [pendingKycCount, setPendingKycCount] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const kycData = await getKycQueue({ status: 'PENDING', size: 1 })
      setPendingKycCount(kycData.totalElements)
    } catch {
      setPendingKycCount(0)
    }

    try {
      // Total users — GET /admin/kyc-queue sans filtre pour avoir tous les users
      // TODO: remplacer par GET /admin/users?size=1 quand l'endpoint existera
      const allUsers = await getKycQueue({ size: 1 })
      setTotalUsers(allUsers.totalElements)
    } catch {
      setTotalUsers(0)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

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
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onGoToKycQueue={() => router.push('/(admin)/kyc-queue')}
      onLogout={async () => {
        await logout()
        router.replace('/(auth)/onboarding')
      }}
    />
  )
}
