import { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { OTP_LENGTH } from '../../../shared/constants/app.constants';
import { Radius, Spacing } from '../../../theme/spacing';
import { FontSize, FontWeight } from '../../../theme/typography';
import { Colors } from '../../../theme';

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChangeDigit = (digit: string, index: number) => {
    if (!/^\d*$/.test(digit)) return;

    const next = [...value];
    next[index] = digit.slice(-1);
    onChange(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => {
        const digit = value[i] ?? '';
        return (
          <TextInput
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={digit}
            onChangeText={(text) => handleChangeDigit(text, i)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            style={[styles.box, digit ? styles.boxFilled : styles.boxEmpty]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
    justifyContent: 'center',
    marginBottom: Spacing[8],
  },
  box: {
    width: 46,
    height: 54,
    borderRadius: Radius.lg,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    borderWidth: 2,
  },
  boxEmpty: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.transparent,
  },
  boxFilled: {
    backgroundColor: '#e8faf0',
    borderColor: Colors.primary,
  },
});
