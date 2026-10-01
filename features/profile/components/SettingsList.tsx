import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { Colors, FontSize, Spacing, Radius } from '../../../theme'

export interface SettingsItem {
  id: string
  Icon: React.ComponentType<{ size: number; color: string }>
  label: string
  color: string
  value?: string
  valueColor?: string
  onPress: () => void
}

interface SettingsListProps {
  items: SettingsItem[]
}

export function SettingsList({ items }: SettingsListProps) {
  return (
    <View style={styles.card}>
      {items.map((item, i) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.row, i < items.length - 1 && styles.rowBorder]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View
            style={[styles.iconBox, { backgroundColor: `${item.color}18` }]}
          >
            <item.Icon size={18} color={item.color} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
          {item.value ? (
            <Text
              style={[
                styles.value,
                item.valueColor
                  ? { color: item.valueColor, fontWeight: '600' }
                  : null,
              ]}
            >
              {item.value}
            </Text>
          ) : null}
          <ChevronRight size={16} color='#d1d5db' />
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    overflow: 'hidden',
    marginBottom: Spacing[6],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
  value: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
  },
})
