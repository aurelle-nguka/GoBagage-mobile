import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/auth.store'
import { useDashboardData } from '../../features/admin/hooks/useDashboardData'
import { AdminDashboardScreen } from '../../features/admin/screens/AdminDashboardScreen'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { stats, pendingKycCount, commissionBalanceCad, unreadNotifications, refreshing, refresh } = useDashboardData()

  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Admin'

  return (
    <AdminDashboardScreen
      adminName={adminName}
      pendingKycCount={pendingKycCount}
      totalUsers={stats?.totalUsers ?? 0}
      activeTrips={stats?.activeTrips ?? 0}
      commissionBalanceCad={commissionBalanceCad}
      unreadNotifications={unreadNotifications}
      refreshing={refreshing}
      onRefresh={refresh}
      onPressNotifications={() => router.push('/(modals)/notifications')}
      onGoToKycQueue={() => router.push('/(admin)/kyc-queue')}
      onGoToCorridors={() => router.push('/(admin)/corridors')}
      onGoToUsers={() => router.push('/(admin)/users')}
      onGoToDisputes={() => router.push('/(admin)/disputes')}
      onGoToPayouts={() => router.push('/(modals)/payouts')}
      onLogout={async () => {
        await logout()
        router.replace('/(auth)/onboarding')
      }}
    />
  )
}
