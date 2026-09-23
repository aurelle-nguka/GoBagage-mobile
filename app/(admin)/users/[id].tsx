import { useRouter, useLocalSearchParams } from 'expo-router'
import { UserDetailScreen } from '../../../features/admin/screens/UserDetailScreen'

export default function UserDetailPage() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  return <UserDetailScreen userId={id} onBack={() => router.back()} />
}
