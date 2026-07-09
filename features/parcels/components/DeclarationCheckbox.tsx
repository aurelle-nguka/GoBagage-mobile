import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../../../theme';

interface DeclarationCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export function DeclarationCheckbox({ checked, onToggle }: DeclarationCheckboxProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.8}>
      <View style={[styles.box, checked ? styles.boxChecked : styles.boxUnchecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.text}>
        I confirm that the content of this parcel is{' '}
        <Text style={styles.bold}>legal, not restricted</Text>, and complies with all applicable
        customs regulations. I accept full legal responsibility.
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxUnchecked: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  boxChecked: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
  },
  text: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.foreground,
    lineHeight: FontSize.sm * 1.6,
  },
  bold: {
    fontWeight: '700',
  },
});
