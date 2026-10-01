import { useRouter, useLocalSearchParams } from 'expo-router'
import { ChatScreen } from '../../../features/messaging/screens/ChatScreen'

export default function ChatPage() {
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  return <ChatScreen bookingId={bookingId} onBack={() => router.back()} />
}
