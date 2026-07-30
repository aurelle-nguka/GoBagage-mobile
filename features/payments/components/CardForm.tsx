/**
 * Go Bagage — CardForm
 * Saisie carte bancaire (affiché uniquement si provider = STRIPE).
 * En production, ces champs seront remplacés par le Stripe SDK natif (CardField)
 * pour ne jamais faire transiter les données de carte par notre propre state/API.
 */

import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors } from '../../../theme/colors'
import { FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface CardFormProps {
  cardNumber: string
  expiry: string
  cvv: string
  onChangeCardNumber: (value: string) => void
  onChangeExpiry: (value: string) => void
  onChangeCvv: (value: string) => void
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function CardForm({
  cardNumber,
  expiry,
  cvv,
  onChangeCardNumber,
  onChangeExpiry,
  onChangeCvv,
}: CardFormProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>{t('payment.card_number', 'Card Number')}</Text>
        <TextInput
          value={cardNumber}
          onChangeText={(text) => onChangeCardNumber(formatCardNumber(text))}
          placeholder='1234 5678 9012 3456'
          placeholderTextColor='#9ca3af'
          keyboardType='number-pad'
          style={[styles.input, styles.cardNumberInput]}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>{t('payment.expiry', 'Expiry')}</Text>
          <TextInput
            value={expiry}
            onChangeText={(text) => onChangeExpiry(formatExpiry(text))}
            placeholder='MM/YY'
            placeholderTextColor='#9ca3af'
            keyboardType='number-pad'
            style={styles.input}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>{t('payment.cvv', 'CVV')}</Text>
          <TextInput
            value={cvv}
            onChangeText={(text) =>
              onChangeCvv(text.replace(/\D/g, '').slice(0, 3))
            }
            placeholder='•••'
            placeholderTextColor='#9ca3af'
            keyboardType='number-pad'
            secureTextEntry
            style={styles.input}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    gap: Spacing[4],
    marginBottom: Spacing[5],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
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
  cardNumberInput: {
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  half: {
    flex: 1,
  },
})
