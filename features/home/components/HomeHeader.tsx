import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Bell, MessageSquare, Package, Plane } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

type DashboardView = 'sender' | 'traveler'

interface HomeHeaderProps {
  firstName: string
  unreadNotifications: number
  showToggle: boolean
  view: DashboardView
  onChangeView: (view: DashboardView) => void
  onPressNotifications: () => void
  onPressMessages?: () => void
}

export function HomeHeader({
  firstName,
  unreadNotifications,
  showToggle,
  view,
  onChangeView,
  onPressNotifications,
  onPressMessages,
}: HomeHeaderProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting}>
            {t('home.welcome_back', 'Bon retour,')}
          </Text>
          <Text style={styles.name}>{firstName} 👋</Text>
        </View>

        <View style={styles.actionButtons}>
          {onPressMessages ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onPressMessages}
              activeOpacity={0.8}
            >
              <MessageSquare size={20} color={Colors.white} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onPressNotifications}
            activeOpacity={0.8}
          >
            <Bell size={20} color={Colors.white} />
            {unreadNotifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {showToggle && (
        <View style={styles.toggleRow}>
          <ToggleButton
            label={t('home.role_sender', 'Expéditeur')}
            icon={
              <Package
                size={16}
                color={
                  view === 'sender' ? Colors.primary : 'rgba(255,255,255,0.9)'
                }
              />
            }
            active={view === 'sender'}
            onPress={() => onChangeView('sender')}
          />
          <ToggleButton
            label={t('home.role_traveler', 'Voyageur')}
            icon={
              <Plane
                size={16}
                color={
                  view === 'traveler'
                    ? Colors.primary
                    : 'rgba(255,255,255,0.9)'
                }
              />
            }
            active={view === 'traveler'}
            onPress={() => onChangeView('traveler')}
          />
        </View>
      )}
    </View>
  )
}

function ToggleButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string
  icon: React.ReactNode
  active: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={[styles.toggleButton, active && styles.toggleButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.toggleInner}>
        {icon}
        <Text style={[styles.toggleText, active && styles.toggleTextActive]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.base,
  },
  name: {
    color: Colors.white,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: FontWeight.bold,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.lg,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing[2],
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: 'rgba(255,255,255,0.9)',
  },
  toggleTextActive: {
    color: Colors.primary,
  },
});
