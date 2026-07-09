import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
}

export function TextField({ label, isPassword = false, style, ...inputProps }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          {...inputProps}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor="#9ca3af"
          style={[
            styles.input,
            focused && styles.inputFocused,
            isPassword && styles.inputWithIcon,
            style,
          ]}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showPassword ? (
              <EyeOff size={18} color="#9ca3af" />
            ) : (
              <Eye size={18} color="#9ca3af" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.transparent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  inputWithIcon: {
    paddingRight: Spacing[12],
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing[4],
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
