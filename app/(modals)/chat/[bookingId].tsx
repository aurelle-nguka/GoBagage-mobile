/**
 * Go Bagage — Modale Chat
 */

import { useRouter, useLocalSearchParams } from 'expo-router'
import { ChatScreen } from '../../../features/messaging/screens/ChatScreen'

export default function ChatPage() {
  const router = useRouter()
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

  // TODO: remplacer par features/messaging/hooks/useChat(bookingId) pour les vraies données
  return (
    <ChatScreen
      travelerInitials='KA'
      travelerName='Kofi Asante'
      routeLabel='Montreal → Douala · Jun 18'
      onBack={() => router.back()}
      onCall={() => {
        // TODO: action d'appel — nécessite confirmation que les coordonnées sont partagées
      }}
      onMore={() => {
        // TODO: menu (signaler, voir profil, etc.)
      }}
    />
  )
}
