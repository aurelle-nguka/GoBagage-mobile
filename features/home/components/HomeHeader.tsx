import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme';

type DashboardView = 'sender' | 'traveler';

interface HomeHeaderProps {
  firstName: string;
  unreadNotifications: number;
  showToggle: boolean;
  view: DashboardView;
  onChangeView: (view: DashboardView) => void;
  onPressNotifications: () => void;
}

export function HomeHeader({
  firstName,
  unreadNotifications,
  showToggle,
  view,
  onChangeView,
  onPressNotifications,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{firstName} 👋</Text>
        </View>

        <TouchableOpacity style={styles.bellButton} onPress={onPressNotifications}>
          <Bell size={20} color={Colors.white} />
          {unreadNotifications > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showToggle && (
        <View style={styles.toggleRow}>
          <ToggleButton
            label="📦 Sender"
            active={view === 'sender'}
            onPress={() => onChangeView('sender')}
          />
          <ToggleButton
            label="✈️ Traveler"
            active={view === 'traveler'}
            onPress={() => onChangeView('traveler')}
          />
        </View>
      )}
    </View>
  );
}

function ToggleButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.toggleButton, active && styles.toggleButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
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
  bellButton: {
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
  toggleText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: 'rgba(255,255,255,0.9)',
  },
  toggleTextActive: {
    color: Colors.primary,
  },
});
