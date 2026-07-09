/**
 * Go Bagage — PaymentMethodSelector
 * Sélection de la méthode de paiement (CDC section 6.4).
 * Aligné sur l'enum PaymentProvider : STRIPE | INTERAC | ORANGE | MTN.
 */

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'

import type { PaymentProvider } from '../types/payment.types'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

interface PaymentMethodConfig {
  provider: PaymentProvider
  label: string
  sublabel: string
  icon: string
}

const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    provider: 'STRIPE',
    label: 'Credit / Debit Card',
    sublabel: 'Powered by Stripe',
    icon: '💳',
  },
  {
    provider: 'ORANGE',
    label: 'Orange Money',
    sublabel: 'Mobile money',
    icon: '🟠',
  },
  { provider: 'MTN', label: 'MTN MoMo', sublabel: 'Mobile money', icon: '🟡' },
  {
    provider: 'INTERAC',
    label: 'Interac e-Transfer',
    sublabel: 'Canadian banks',
    icon: '🇨🇦',
  },
]

interface PaymentMethodSelectorProps {
  selected: PaymentProvider
  onSelect: (provider: PaymentProvider) => void
}

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <View style={styles.list}>
      {PAYMENT_METHODS.map((method) => {
        const isActive = method.provider === selected
        return (
          <TouchableOpacity
            key={method.provider}
            onPress={() => onSelect(method.provider)}
            activeOpacity={0.85}
            style={[
              styles.row,
              isActive ? styles.rowActive : styles.rowInactive,
            ]}
          >
            <Text style={styles.icon}>{method.icon}</Text>
            <View style={styles.labelBlock}>
              <Text style={styles.label}>{method.label}</Text>
              <Text style={styles.sublabel}>{method.sublabel}</Text>
            </View>
            <View style={[styles.radio, isActive && styles.radioActive]}>
              {isActive && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
    borderRadius: Radius.xl,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  rowInactive: {
    backgroundColor: Colors.white,
    borderColor: '#f3f4f6',
  },
  rowActive: {
    backgroundColor: '#e8faf0',
    borderColor: Colors.primary,
  },
  icon: {
    fontSize: 28,
  },
  labelBlock: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
  },
  sublabel: {
    fontSize: FontSize.sm,
    color: '#9ca3af',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 11,
  },
})
