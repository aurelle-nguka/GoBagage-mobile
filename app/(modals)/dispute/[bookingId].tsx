import { useRouter, useLocalSearchParams } from 'expo-router'
import { ReportProblemScreen } from '../../../features/disputes/screens/ReportProblemScreen'

export default function ReportProblemPage() {
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  return (
    <ReportProblemScreen
      bookingId={bookingId}
      onBack={() => router.back()}
      onDone={() => router.back()}
    />
  )
}
