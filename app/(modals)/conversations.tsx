import { useRouter } from 'expo-router'
import { ConversationsListScreen } from '../../features/messaging/screens/ConversationsListScreen'

export default function ConversationsModal() {
  const router = useRouter()

  return (
    <ConversationsListScreen
      onBack={() => router.back()}
      onSelectConversation={(bookingId) => {
        router.push(`/(modals)/chat/${bookingId}`)
      }}
    />
  )
}
