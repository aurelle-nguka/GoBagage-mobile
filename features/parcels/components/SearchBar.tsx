import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Colors, FontSize, Radius, Spacing } from '../../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  editable?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmit,
  onClear,
  editable = true,
}: SearchBarProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.wrapper}>
      <Search size={18} color="#9ca3af" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? t('search.placeholder', 'e.g. Montreal - Douala')}
        placeholderTextColor="#9ca3af"
        editable={editable}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        style={styles.input}
      />
      {onClear && value ? (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={16} color="#9ca3af" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: Radius.xl,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.foreground,
  },
});
