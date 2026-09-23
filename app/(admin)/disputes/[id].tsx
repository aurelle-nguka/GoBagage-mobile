import { useRouter, useLocalSearchParams } from 'expo-router'
import { DisputeDetailScreen } from '../../../features/admin/screens/DisputeDetailScreen'

export default function DisputeDetailPage() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  return <DisputeDetailScreen disputeId={id} onBack={() => router.back()} />
}
