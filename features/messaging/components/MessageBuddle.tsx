import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native'
import { Lock, X } from 'lucide-react-native'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'
import { API_BASE_URL } from '../../../shared/constants/api.constants'
import { AudioMessagePlayer } from './AudioMessagePlayer'

export type MessageSender = 'me' | 'traveler' | 'system'

interface MessageBubbleProps {
  text: string
  sender: MessageSender
  time: string
  senderInitials?: string
  mediaUrl?: string
  contentType?: 'TEXT' | 'IMAGE' | 'AUDIO' | 'SYSTEM'
  durationSeconds?: number
}

function resolveMediaUrl(url?: string): string | null {
  if (!url) return null
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('file://')
  ) {
    return url
  }
  const serverOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${serverOrigin}${url.startsWith('/') ? '' : '/'}${url}`
}

export function MessageBubble({
  text,
  sender,
  time,
  senderInitials,
  mediaUrl,
  contentType,
  durationSeconds,
}: MessageBubbleProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const fullMediaUrl = resolveMediaUrl(mediaUrl)

  if (sender === 'system') {
    return (
      <View style={styles.systemRow}>
        <View style={styles.systemBubbleRow}>
          <Lock size={12} color={Colors.primary} />
          <Text style={styles.systemText}>{text}</Text>
        </View>
      </View>
    )
  }

  const isMe = sender === 'me'
  const isAudio =
    contentType === 'AUDIO' ||
    (mediaUrl &&
      (mediaUrl.endsWith('.m4a') ||
        mediaUrl.endsWith('.aac') ||
        mediaUrl.endsWith('.mp3') ||
        mediaUrl.endsWith('.wav')))

  return (
    <View style={[styles.messageRow, isMe ? styles.rowEnd : styles.rowStart]}>
      {!isMe && (
        <View style={styles.smallAvatar}>
          <Text style={styles.smallAvatarText}>{senderInitials}</Text>
        </View>
      )}

      <View style={styles.bubbleColumn}>
        <View
          style={[
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
            isMe ? styles.bubbleTailMe : styles.bubbleTailOther,
          ]}
        >
          {isAudio && fullMediaUrl ? (
            <AudioMessagePlayer
              audioUrl={fullMediaUrl}
              isMe={isMe}
              durationSeconds={durationSeconds}
            />
          ) : fullMediaUrl ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setModalVisible(true)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: fullMediaUrl }}
                style={styles.bubbleImage}
                resizeMode='cover'
              />
            </TouchableOpacity>
          ) : null}

          {text && !isAudio ? (
            <Text
              style={[
                styles.text,
                isMe ? styles.textMe : styles.textOther,
                fullMediaUrl ? { marginTop: 6 } : null,
              ]}
            >
              {text}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.time, isMe ? styles.timeRight : styles.timeLeft]}>
          {time}
        </Text>
      </View>

      {fullMediaUrl && !isAudio && (
        <Modal
          visible={modalVisible}
          transparent
          animationType='fade'
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
            <Image
              source={{ uri: fullMediaUrl }}
              style={styles.fullImage}
              resizeMode='contain'
            />
          </Pressable>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  systemRow: {
    alignItems: 'center',
    marginVertical: Spacing[2],
  },
  systemBubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e8faf0',
    borderWidth: 1,
    borderColor: '#c8f5df',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
  },
  systemText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    maxWidth: '100%',
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  rowStart: {
    justifyContent: 'flex-start',
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[2],
    alignSelf: 'flex-end',
  },
  smallAvatarText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  bubbleColumn: {
    maxWidth: '78%',
  },
  bubble: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius['2xl'],
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
  },
  bubbleOther: {
    backgroundColor: Colors.white,
  },
  bubbleTailMe: {
    borderBottomRightRadius: 4,
  },
  bubbleTailOther: {
    borderBottomLeftRadius: 4,
  },
  imageContainer: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  bubbleImage: {
    width: 200,
    height: 150,
    borderRadius: Radius.lg,
  },
  text: {
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.4,
    paddingHorizontal: 4,
  },
  textMe: {
    color: Colors.white,
  },
  textOther: {
    color: Colors.foreground,
  },
  time: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 3,
  },
  timeRight: {
    textAlign: 'right',
  },
  timeLeft: {
    textAlign: 'left',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Radius.full,
  },
  fullImage: {
    width: '90%',
    height: '75%',
  },
})
