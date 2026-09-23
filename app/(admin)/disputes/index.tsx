import { useRouter } from 'expo-router'
import { DisputeQueueScreen } from '../../../features/admin/screens/DisputeQueueScreen'

export default function DisputeQueuePage() {
  const router = useRouter()

  return (
    <DisputeQueueScreen
      onBack={() => router.back()}
      onOpenDispute={(dispute) => router.push(`/(admin)/disputes/${dispute.id}`)}
    />
  )
}
