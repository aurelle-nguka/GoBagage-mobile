import { useRouter } from 'expo-router'
import { AllActivityScreen } from '../../features/profile/screens/AllActivityScreen'

export default function ActivityPage() {
  const router = useRouter()
  return (
    <AllActivityScreen
      onBack={() => router.back()}
      onOpenBooking={(bookingId) =>
        router.push(`/(modals)/tracking/${bookingId}`)
      }
      onOpenReview={(bookingId) => router.push(`/(modals)/review/${bookingId}`)}
    />
  )
}
