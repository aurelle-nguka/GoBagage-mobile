import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme';

interface ParcelFormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ParcelFormSection({ title, children }: ParcelFormSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing[5],
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    gap: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
});
