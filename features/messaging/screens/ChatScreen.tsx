/**
 * Go Bagage — ChatScreen
 * Messagerie sécurisée entre voyageur et expéditeur (CDC section 6.5).
 * Migré depuis Chat.tsx (maquette web) → React Native.
 *
 * Différence clé vs la maquette : utilise une FlatList inversée (pattern standard
 * des apps de chat RN) au lieu d'un scroll manuel + scrollIntoView, pour de meilleures
 * performances avec de longs historiques de conversation.
 */

import { useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ChatInput } from '../components/ChatInput'
import { MessageBubble, MessageSender } from '../components/MessageBuddle'
import { ConversationHeader } from '../components/ConversationHeader'
import { PrivacyNoticeBanner } from '../components/PrivacyNoticeBanner'

interface ChatMessage {
  id: string
  text: string
  sender: MessageSender
  time: string
}

// TODO: remplacer par features/messaging/hooks/useChat(bookingId) — WebSocket + historique réel
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Booking confirmed for Montreal → Douala. Coordinate pickup details below.',
    sender: 'system',
    time: 'Jun 13',
  },
  {
    id: '2',
    text: 'Hello! Your parcel is confirmed. We can arrange pickup at Trudeau Airport Terminal 3, June 16th at 9 AM. Does that work?',
    sender: 'traveler',
    time: '10:34 AM',
  },
  {
    id: '3',
    text: "Perfect! That works for me. I'll have the parcel ready. Should I wrap it in a specific way?",
    sender: 'me',
    time: '10:41 AM',
  },
  {
    id: '4',
    text: "Yes please — double-wrap in plastic and label it clearly with the recipient name and Douala address. I'll weigh it on arrival.",
    sender: 'traveler',
    time: '10:45 AM',
  },
  {
    id: '5',
    text: "Got it! I'll bring the signed declaration form as well. Thank you 🙏",
    sender: 'me',
    time: '10:47 AM',
  },
]

interface ChatScreenProps {
  travelerInitials: string
  travelerName: string
  routeLabel: string
  onBack: () => void
  onCall: () => void
  onMore: () => void
}

export function ChatScreen({
  travelerInitials,
  travelerName,
  routeLabel,
  onBack,
  onCall,
  onMore,
}: ChatScreenProps) {
  // Stockées en ordre chronologique inverse (le plus récent en premier) pour la FlatList inversée
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    [...INITIAL_MESSAGES].reverse(),
  )
  const [input, setInput] = useState('')

  const formatNow = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      time: formatNow(),
    }
    setMessages((prev) => [newMessage, ...prev])
    setInput('')

    // TODO: brancher features/messaging/api/messaging.api.ts → POST /conversations/{id}/messages
    // Simulation de réponse — à retirer une fois le WebSocket réel branché
    setTimeout(() => {
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          text: "Thanks for the message! I'll confirm once I receive the parcel.",
          sender: 'traveler',
          time: formatNow(),
        },
        ...prev,
      ])
    }, 1800)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ConversationHeader
        initials={travelerInitials}
        name={travelerName}
        routeLabel={routeLabel}
        onBack={onBack}
        onCall={onCall}
        onMore={onMore}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              sender={item.sender}
              time={item.time}
              senderInitials={travelerInitials}
            />
          )}
        />

        <PrivacyNoticeBanner />

        <ChatInput
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          onAttach={() => {
            // TODO: brancher expo-image-picker pour l'envoi de photos dans le chat
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
})
