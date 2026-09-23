import { useRouter } from 'expo-router'
import { UserManagementScreen } from '../../../features/admin/screens/UserManagementScreen'

export default function UserManagementPage() {
  const router = useRouter()

  return (
    <UserManagementScreen
      onBack={() => router.back()}
      onOpenUser={(user) => router.push(`/(admin)/users/${user.id}`)}
    />
  )
}
