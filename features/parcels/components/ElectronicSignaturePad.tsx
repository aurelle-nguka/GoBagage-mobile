import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
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
  return (
    <View>
      <Text style={styles.label}>Electronic Signature *</Text>
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
            <Text style={styles.signedLabel}>✓ Signed electronically</Text>
          </>
        ) : (
          <>
            <Text style={styles.signEmoji}>✍️</Text>
            <Text style={styles.tapLabel}>Tap to sign</Text>
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
  signEmoji: { fontSize: 24 },
  tapLabel: { fontSize: FontSize.sm, color: '#9ca3af' },
  signatureName: {
    fontSize: FontSize['2xl'],
    fontStyle: 'italic',
    color: Colors.primary,
    fontWeight: '700',
  },
  signedLabel: { fontSize: 11, color: Colors.primary },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.destructive,
    marginTop: Spacing[1],
  },
})
