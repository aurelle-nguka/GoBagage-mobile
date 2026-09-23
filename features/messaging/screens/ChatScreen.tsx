/**
 * Go Bagage — ChatScreen
 * Messagerie sécurisée entre voyageur et expéditeur (CDC section 6.5).
 * Branché sur features/messaging/hooks/useChat(bookingId) — historique REST + WebSocket temps réel.
 * Support des pièces jointes / photos avec aperçu WhatsApp, légende combinée, appel direct et modération.
 */

import { useMemo, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useTranslation } from 'react-i18next'
import * as ImagePicker from 'expo-image-picker'

import { ChatInput } from '../components/ChatInput'
import { MessageBubble } from '../components/MessageBuddle'
import { ConversationHeader } from '../components/ConversationHeader'
import { PrivacyNoticeBanner } from '../components/PrivacyNoticeBanner'
import { ChatOptionsMenu } from '../components/ChatOptionsMenu'
import { ContactProfileModal } from '../components/ContactProfileModal'
import { ConversationMediaModal } from '../components/ConversationMediaModal'
import { ReportUserModal } from '../components/ReportUserModal'
import { OpenDisputeModal } from '../components/OpenDisputeModal'
import { ImageAttachmentPreviewModal } from '../components/ImageAttachmentPreviewModal'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { Colors } from '../../../theme'
import { useChat } from '../hooks/useChat'

interface ChatScreenProps {
  bookingId: string
  onBack: () => void
  onCall?: () => void
  onMore?: () => void
  onViewProfile?: () => void
}

export function ChatScreen({
  bookingId,
  onBack,
  onCall,
  onMore,
  onViewProfile,
}: ChatScreenProps) {
  const { t, i18n } = useTranslation()
  const { messages, conversation, loading, error, send, sendAttachment, sendVoiceNote } = useChat(bookingId)
  const [input, setInput] = useState('')

  const [optionsVisible, setOptionsVisible] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)
  const [mediaVisible, setMediaVisible] = useState(false)
  const [reportVisible, setReportVisible] = useState(false)
  const [disputeVisible, setDisputeVisible] = useState(false)

  // Aperçu WhatsApp pour les photos sélectionnées
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    send(text)
  }

  const handleAttach = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert(
          t('common.permission_denied', 'Permission requise'),
          t('messaging.permission_gallery', 'Veuillez autoriser l\'accès à la galerie pour envoyer une photo.')
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uris = result.assets.map((a) => a.uri).filter(Boolean)
        if (uris.length > 0) {
          setSelectedImages(uris)
        }
      }
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('messaging.attach_error', 'Impossible d\'ouvrir la galerie.'))
    }
  }

  const handleSendPreview = async (images: string[], caption: string) => {
    try {
      // La première image reçoit la légende (saisie dans l'aperçu)
      if (images.length > 0) {
        await sendAttachment(images[0], caption || undefined)
      }
      // Les images supplémentaires suivantes sont envoyées ensuite
      for (let i = 1; i < images.length; i++) {
        await sendAttachment(images[i])
      }
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('messaging.attach_error', 'Impossible d\'envoyer les photos.'))
    }
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCall = () => {
    if (onCall) {
      onCall()
      return
    }
    const phone = conversation?.otherParticipant?.phoneNumber
    if (phone) {
      Linking.openURL(`tel:${phone}`)
    } else {
      Alert.alert(
        t('messaging.call.title', 'Appel téléphonique'),
        t(
          'messaging.call.unavailable',
          'Le numéro de téléphone sera accessible dès que la réservation sera confirmée et acceptée par le voyageur.'
        )
      )
    }
  }

  const handleMore = () => {
    if (onMore) {
      onMore()
      return
    }
    setOptionsVisible(true)
  }

  const other = conversation?.otherParticipant
  const participantInitials = other
    ? `${other.firstName?.[0] ?? ''}${other.lastNameInitial ?? ''}`.toUpperCase()
    : 'GB'
  const participantName = other
    ? `${other.firstName} ${other.lastNameInitial ? `${other.lastNameInitial}.` : ''}`.trim()
    : t('messaging.chat_title', 'Conversation')

  const dateSuffix = useMemo(() => {
    if (!conversation?.departureDate) return undefined
    try {
      const date = new Intl.DateTimeFormat(i18n.language, {
        month: 'short',
        day: 'numeric',
      }).format(new Date(conversation.departureDate))
      return ` · ${date}`
    } catch {
      return undefined
    }
  }, [conversation?.departureDate, i18n.language])

  const fallbackRouteLabel = conversation?.bookingId
    ? `${t('booking.title', 'Booking')} #${conversation.bookingId}`
    : `#${bookingId}`

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ConversationHeader
        initials={participantInitials}
        name={participantName}
        profilePhotoUrl={conversation?.participant?.profilePhotoUrl}
        corridor={conversation?.corridor}
        suffix={dateSuffix}
        routeLabel={fallbackRouteLabel}
        onBack={onBack}
        onCall={handleCall}
        onMore={handleMore}
        onPressProfile={() => setContactVisible(true)}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {error ? <ErrorBanner message={error} /> : null}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='interactive'
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              sender={item.sender}
              time={item.time}
              senderInitials={participantInitials}
              mediaUrl={item.mediaUrl}
              contentType={item.contentType}
            />
          )}
        />

        <PrivacyNoticeBanner />

        <ChatInput
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          onAttach={handleAttach}
          onSendVoice={(audioUri, durationSeconds) => {
            sendVoiceNote(audioUri, durationSeconds)
          }}
        />
      </KeyboardAvoidingView>

      <ChatOptionsMenu
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        onViewContact={() => {
          if (onViewProfile) {
            onViewProfile()
          } else {
            setContactVisible(true)
          }
        }}
        onViewMedia={() => setMediaVisible(true)}
        onDispute={() => setDisputeVisible(true)}
        onReport={() => setReportVisible(true)}
      />

      <ContactProfileModal
        visible={contactVisible}
        onClose={() => setContactVisible(false)}
        participant={conversation?.otherParticipant}
        corridor={conversation?.corridor}
        departureDate={conversation?.departureDate}
        bookingId={conversation?.bookingId ?? bookingId}
        onDispute={() => setDisputeVisible(true)}
        onReport={() => setReportVisible(true)}
      />

      <ConversationMediaModal
        visible={mediaVisible}
        onClose={() => setMediaVisible(false)}
        messages={messages}
        participantName={participantName}
      />

      <ReportUserModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        reportedUserId={conversation?.otherParticipant?.id ?? ''}
        reportedUserName={participantName}
        bookingId={conversation?.bookingId ?? bookingId}
      />

      <OpenDisputeModal
        visible={disputeVisible}
        onClose={() => setDisputeVisible(false)}
        bookingId={conversation?.bookingId ?? bookingId}
      />

      <ImageAttachmentPreviewModal
        visible={selectedImages.length > 0}
        images={selectedImages}
        onClose={() => setSelectedImages([])}
        onSend={handleSendPreview}
        onRemoveImage={handleRemoveImage}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
})
