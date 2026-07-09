import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme';

interface PrimaryButtonProps {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  loadingLabel,
  loading = false,
  disabled = false,
  onPress,
  style,
}: PrimaryButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color={Colors.white} />
          <Text style={styles.label}>{loadingLabel ?? label}</Text>
        </>
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  buttonDisabled: {
    backgroundColor: '#a7f0c7',
  },
  label: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
