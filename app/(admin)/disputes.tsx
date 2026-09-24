import { useRouter } from 'expo-router'
import { DisputesListScreen } from '../../features/admin/screens/DisputesListScreen'

export default function AdminDisputesPage() {
  const router = useRouter()
  return <DisputesListScreen onBack={() => router.back()} />
}
