import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { PenLine, CheckCircle2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, Radius, Spacing } from '../../../theme'

interface ElectronicSignaturePadProps {
  signed: boolean
  signerName: string
  onToggle: () => void
  error?: string
}

export function ElectronicSignaturePad({
  signed,
  signerName,
  onToggle,
  error,
}: ElectronicSignaturePadProps) {
  const { t } = useTranslation()

  return (
    <View>
      <Text style={styles.label}>{`${t('parcel.electronic_signature', 'Electronic Signature')} *`}</Text>
      <TouchableOpacity
        style={[
          styles.pad,
          signed ? styles.padSigned : styles.padEmpty,
          error && !signed ? styles.padError : null,
        ]}
        onPress={onToggle}
        activeOpacity={0.85}
      >
        {signed ? (
          <>
            <Text style={styles.signatureName}>{signerName}</Text>
            <View style={styles.signedRow}>
              <CheckCircle2 size={12} color={Colors.primary} />
              <Text style={styles.signedLabel}>
                {t('parcel.signed_electronically', 'Signed electronically')}
              </Text>
            </View>
          </>
        ) : (
          <>
            <PenLine size={24} color='#9ca3af' />
            <Text style={styles.tapLabel}>{t('parcel.tap_to_sign', 'Tap to sign')}</Text>
          </>
        )}
      </TouchableOpacity>
      {error && !signed ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.foreground,
    marginBottom: Spacing[1],
  },
  pad: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  padEmpty: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    backgroundColor: '#fafafa',
  },
  padSigned: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#e8faf0',
  },
  padError: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.destructive,
    backgroundColor: '#fef2f2',
  },
  tapLabel: { fontSize: FontSize.sm, color: '#9ca3af' },
  signatureName: {
    fontSize: FontSize['2xl'],
    fontStyle: 'italic',
    color: Colors.primary,
    fontWeight: '700',
  },
  signedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signedLabel: { fontSize: 11, color: Colors.primary },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
})
