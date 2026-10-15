/**
 * Go Bagage — MessageBubble
 * Bulle de message : 3 variantes (système, moi, interlocuteur).
 */

import { View, Text, StyleSheet } from 'react-native'
import { Lock } from 'lucide-react-native'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'

export type MessageSender = 'me' | 'traveler' | 'system'

interface MessageBubbleProps {
  text: string
  sender: MessageSender
  time: string
  senderInitials?: string
}

export function MessageBubble({
  text,
  sender,
  time,
  senderInitials,
}: MessageBubbleProps) {
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
          <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
            {text}
          </Text>
        </View>
        <Text style={[styles.time, isMe ? styles.timeRight : styles.timeLeft]}>
          {time}
        </Text>
      </View>
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
    maxWidth: '72%',
  },
  bubble: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
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
  text: {
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.5,
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
})
