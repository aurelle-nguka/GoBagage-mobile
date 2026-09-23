import { useRouter } from 'expo-router'
import { SubscriptionScreen } from '../../features/subscription/screens/SubscriptionScreen'

export default function SubscriptionPage() {
  const router = useRouter()
  return <SubscriptionScreen onBack={() => router.back()} />
}
