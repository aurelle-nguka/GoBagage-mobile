import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme';

interface SearchHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export function SearchHeader({ title, subtitle, onBack }: SearchHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <ArrowLeft size={22} color={Colors.foreground} />
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
  },
});
