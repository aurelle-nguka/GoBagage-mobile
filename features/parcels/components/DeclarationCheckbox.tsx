import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Check } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'

interface DeclarationCheckboxProps {
  checked: boolean
  onToggle: () => void
  error?: string
}

export function DeclarationCheckbox({
  checked,
  onToggle,
  error,
}: DeclarationCheckboxProps) {
  const { t } = useTranslation()

  return (
    <View>
      <TouchableOpacity
        style={styles.row}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.box,
            checked ? styles.boxChecked : styles.boxUnchecked,
            error && !checked ? styles.boxError : null,
          ]}
        >
          {checked && <Check size={12} color={Colors.white} />}
        </View>
        <Text style={styles.text}>
          {t('parcel.declaration_prefix', 'I confirm that the content of this parcel is')}{' '}
          <Text style={styles.bold}>
            {t('parcel.declaration_bold', 'legal, not restricted')}
          </Text>
          {t(
            'parcel.declaration_suffix',
            ', and complies with all applicable customs regulations. I accept full legal responsibility.',
          )}
        </Text>
      </TouchableOpacity>
      {error && !checked ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
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
  boxError: {
    borderColor: Colors.destructive,
    backgroundColor: '#fef2f2',
  },
  text: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.foreground,
    lineHeight: FontSize.sm * 1.6,
  },
  bold: { fontWeight: '700' },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
})
