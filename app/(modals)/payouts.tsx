import { useRouter } from 'expo-router'
import { PayoutsScreen } from '../../features/payouts/screens/PayoutsScreen'

export default function PayoutsPage() {
  const router = useRouter()
  return <PayoutsScreen onBack={() => router.back()} />
}
