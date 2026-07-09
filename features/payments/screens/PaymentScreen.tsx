/**
 * Go Bagage — PaymentScreen
 * Paiement séquestre (escrow) — CDC section 6.4.
 * Migré depuis Payment.tsx (maquette web) → React Native.
 */

import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { ArrowLeft, Lock } from 'lucide-react-native'
import type { PaymentProvider } from '../types/payment.types'
import {
  calculateCommission,
  formatCAD,
} from '../../../shared/utils/currency.utils'
import { Colors } from '../../../theme/colors'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { FontSize, FontWeight, Spacing } from '../../../theme'
import { CardForm } from '../components/CardForm'
import { EscrowBadge } from '../components/EscrowBadge'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { TripSummaryCard } from '../components/TripSummaryCard'

interface PaymentScreenProps {
  from: string
  to: string
  travelerName: string
  departureDate: string
  weightKg: number
  pricePerKg: number
  onBack: () => void
  onSuccess: (provider: PaymentProvider) => void
}

export function PaymentScreen({
  from,
  to,
  travelerName,
  departureDate,
  weightKg,
  pricePerKg,
  onBack,
  onSuccess,
}: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentProvider>('STRIPE')
  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const subtotalBase = weightKg * pricePerKg
  const { subtotal, commission, total } = calculateCommission(subtotalBase)

  const handlePay = () => {
    setLoading(true)

    // TODO: brancher features/payments/api/payments.api.ts → POST /payments/initiate
    // En production : Stripe Elements/CardField gère la tokenisation, jamais le numéro brut.
    setTimeout(() => {
      setLoading(false)
      onSuccess(selectedMethod)
    }, 1500)
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <View style={styles.sslRow}>
            <Lock size={11} color={Colors.primary} />
            <Text style={styles.sslText}>256-bit SSL encryption</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TripSummaryCard
          from={from}
          to={to}
          travelerName={travelerName}
          departureDate={departureDate}
          weightKg={weightKg}
          pricePerKg={pricePerKg}
          subtotal={subtotal}
          commission={commission}
          total={total}
        />

        <EscrowBadge />

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <PaymentMethodSelector
          selected={selectedMethod}
          onSelect={setSelectedMethod}
        />

        {selectedMethod === 'STRIPE' && (
          <CardForm
            cardNumber={cardNumber}
            expiry={expiry}
            cvv={cvv}
            onChangeCardNumber={setCardNumber}
            onChangeExpiry={setExpiry}
            onChangeCvv={setCvv}
          />
        )}

        <PrimaryButton
          label={`🔒 Pay ${formatCAD(total)} Securely`}
          loadingLabel='Processing payment...'
          loading={loading}
          onPress={handlePay}
          style={styles.payButton}
        />

        <Text style={styles.footerText}>
          Protected by Go Bagage Buyer Guarantee · Cancel anytime before pickup
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  sslRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sslText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[5],
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  payButton: {
    marginBottom: Spacing[4],
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  footerText: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: '#9ca3af',
    marginBottom: Spacing[6],
  },
})
