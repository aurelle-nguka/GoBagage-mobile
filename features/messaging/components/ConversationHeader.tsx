/**
 * Go Bagage — ConversationHeader
 * Header de la conversation : avatar, nom, trajet, actions (appel, menu).
 */

import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { ArrowLeft, Phone, MoreVertical } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'
import { toAbsoluteFileUrl } from '../../../shared/utils/url.utils'

interface ConversationHeaderProps {
  initials: string
  name: string
  profilePhotoUrl?: string | null
  routeLabel?: React.ReactNode | string
  corridor?: { departureCity: string; arrivalCity: string } | null
  suffix?: string
  onBack: () => void
  onCall: () => void
  onMore: () => void
  onPressProfile?: () => void
}

export function ConversationHeader({
  initials,
  name,
  profilePhotoUrl,
  routeLabel,
  corridor,
  suffix,
  onBack,
  onCall,
  onMore,
  onPressProfile,
}: ConversationHeaderProps) {
  const resolvedPhoto = toAbsoluteFileUrl(profilePhotoUrl)

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileClickArea}
        onPress={onPressProfile}
        activeOpacity={onPressProfile ? 0.7 : 1}
      >
        <View style={styles.avatar}>
          {resolvedPhoto ? (
            <Image
              source={{ uri: resolvedPhoto }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {corridor ? (
            <RouteLabel
              from={corridor.departureCity}
              to={corridor.arrivalCity}
              suffix={suffix}
              size="xs"
              color={Colors.mutedForeground}
              arrowColor={Colors.mutedForeground}
              fontWeight="normal"
            />
          ) : typeof routeLabel === 'string' ? (
            <Text style={styles.route} numberOfLines={1}>
              {routeLabel}
            </Text>
          ) : (
            routeLabel
          )}
        </View>
      </TouchableOpacity>

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
    gap: Spacing[2],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[3],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  profileClickArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2] ?? 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
