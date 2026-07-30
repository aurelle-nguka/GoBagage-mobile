
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Colors, FontSize, Radius, Spacing } from '../../../theme';

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <View style={styles.banner}>
      <AlertTriangle size={16} color={Colors.destructive} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: Radius.xl,
    padding: Spacing[3],
    marginBottom: Spacing[4],
  },
  text: {
    flex: 1,
    color: Colors.destructive,
    fontSize: FontSize.sm,
  },
});
