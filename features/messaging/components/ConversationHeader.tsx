/**
 * Go Bagage — ConversationHeader
 * Header de la conversation : avatar, nom, trajet, actions (appel, menu).
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { ArrowLeft, Phone, MoreVertical } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface ConversationHeaderProps {
  initials: string
  name: string
  routeLabel: string
  onBack: () => void
  onCall: () => void
  onMore: () => void
}

export function ConversationHeader({
  initials,
  name,
  routeLabel,
  onBack,
  onCall,
  onMore,
}: ConversationHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.route}>{routeLabel}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onCall}
          activeOpacity={0.8}
        >
          <Phone size={16} color={Colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMore}
          activeOpacity={0.8}
        >
          <MoreVertical size={16} color={Colors.foreground} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  route: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
