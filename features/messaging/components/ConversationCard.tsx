import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { ShieldCheck, ArrowRight } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { Conversation } from '../types/message.types'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface ConversationCardProps {
  conversation: Conversation
  onPress: () => void
  locale?: string
}

export function ConversationCard({ conversation, onPress, locale = 'fr' }: ConversationCardProps) {
  const participant = conversation.otherParticipant
  const initials = participant
  ? `${participant.firstName?.[0] ?? ''}${participant.lastNameInitial ?? ''}`.toUpperCase()
  : 'GB'
  const name = participant ? `${participant.firstName} ${participant.lastNameInitial}.` : 'Utilisateur'

  const formatTime = (iso?: string) => {
    if (!iso) return ''
    try {
      const date = new Date(iso)
      const now = new Date()
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()

      if (isToday) {
        return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date)
      }
      return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date)
    } catch {
      return ''
    }
  }

  const lastMessageText = conversation.lastMessage?.content ?? 'Nouvelle conversation'
  const lastMessageTime = formatTime(conversation.lastMessage?.createdAt ?? conversation.createdAt)

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.avatarContainer}>
        {participant?.profilePhotoUrl ? (
          <Image source={{ uri: participant.profilePhotoUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        {participant?.kycVerified && (
          <View style={styles.kycBadge}>
            <ShieldCheck size={12} color={Colors.white} />
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.time}>{lastMessageTime}</Text>
        </View>

        {conversation.corridor ? (
          <RouteLabel
            from={conversation.corridor.departureCity}
            to={conversation.corridor.arrivalCity}
            size="xs"
            color={Colors.primary}
            arrowColor={Colors.primary}
            fontWeight="semibold"
          />
        ) : (
          <Text style={styles.route} numberOfLines={1}>
            #{conversation.bookingId}
          </Text>
        )}

        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.lastMessage,
              conversation.unreadCount > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {lastMessageText}
          </Text>

          {conversation.unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
            </View>
          ) : (
            <ArrowRight size={16} color={Colors.mutedForeground} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  kycBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  contentContainer: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    flex: 1,
    marginRight: Spacing[2],
  },
  time: {
    fontSize: 11,
    color: Colors.mutedForeground,
  },
  route: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  lastMessage: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    flex: 1,
    marginRight: Spacing[2],
  },
  lastMessageUnread: {
    color: Colors.foreground,
    fontWeight: FontWeight.semibold,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
})
