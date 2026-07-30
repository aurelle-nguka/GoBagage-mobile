import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { ArrowLeft, Lock } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { CardField, type CardFieldInput } from '@stripe/stripe-react-native'
import type { PaymentProvider } from '../types/payment.types'
import {
  calculateCommission,
  formatCAD,
} from '../../../shared/utils/currency.utils'
import { Colors } from '../../../theme/colors'
import { FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { EscrowBadge } from '../components/EscrowBadge'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { TripSummaryCard } from '../components/TripSummaryCard'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { useStripePayment } from '../hooks/useStripePayment'

interface PaymentScreenProps {
  bookingId: string
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
  bookingId,
  from,
  to,
  travelerName,
  departureDate,
  weightKg,
  pricePerKg,
  onBack,
  onSuccess,
}: PaymentScreenProps) {
  const { t } = useTranslation()
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentProvider>('STRIPE')
  const [cardComplete, setCardComplete] = useState(false)
  const { loading, error, pay } = useStripePayment()

  const subtotalBase = weightKg * pricePerKg
  const { subtotal, commission, total } = calculateCommission(subtotalBase)

  const handlePay = async () => {
    if (selectedMethod === 'STRIPE' && !cardComplete) {
      Alert.alert(
        t('payment.card_incomplete', 'Incomplete card'),
        t('payment.card_incomplete_msg', 'Please fill in all card details.'),
      )
      return
    }
    const success = await pay(bookingId)
    if (success) onSuccess(selectedMethod)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{t('payment.title')}</Text>
          <View style={styles.sslRow}>
            <Lock size={11} color={Colors.primary} />
            <Text style={styles.sslText}>{t('payment.ssl')}</Text>
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

        <Text style={styles.sectionTitle}>{t('payment.method')}</Text>
        <PaymentMethodSelector
          selected={selectedMethod}
          onSelect={setSelectedMethod}
        />

        {selectedMethod === 'STRIPE' && (
          <View style={styles.cardSection}>
            <Text style={styles.cardLabel}>{t('payment.card_details')}</Text>
            <CardField
              postalCodeEnabled={false}
              placeholders={{ number: '4242 4242 4242 4242' }}
              cardStyle={{
                backgroundColor: Colors.white,
                textColor: Colors.foreground,
                placeholderColor: '#9ca3af',
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: '#e5e7eb',
                fontSize: 16,
              }}
              style={styles.cardField}
              onCardChange={(cardDetails: CardFieldInput.Details) => {
                setCardComplete(cardDetails.complete)
              }}
            />
            {!cardComplete && (
              <Text style={styles.cardHint}>
                {t(
                  'payment.card_hint',
                  'Enter your card number, expiry date and CVV',
                )}
              </Text>
            )}
            <View style={styles.securityRow}>
              <Lock size={12} color='#9ca3af' />
              <Text style={styles.securityText}>
                {t(
                  'payment.security_text',
                  'Your card details are encrypted by Stripe and never stored on our servers.',
                )}
              </Text>
            </View>
            <Text style={styles.testHint}>{t('payment.test_card')}</Text>
          </View>
        )}

        {(selectedMethod === 'ORANGE_MONEY' ||
          selectedMethod === 'MTN_MOMO') && (
          <View style={styles.momoInfo}>
            <Text style={styles.momoText}>
              {t(
                'payment.momo_info',
                'After confirming, you will receive a prompt on your mobile money phone to authorize the payment.',
              )}
            </Text>
          </View>
        )}

        {error ? <ErrorBanner message={error} /> : null}

        <PrimaryButton
          label={t('payment.pay', { amount: formatCAD(total) })}
          loadingLabel={t('payment.processing')}
          loading={loading}
          onPress={handlePay}
          style={styles.payButton}
        />

        <Text style={styles.footerText}>{t('payment.footer')}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  sslRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sslText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
  },
  cardField: { width: '100%', height: 52, borderRadius: Radius.xl },
  cardHint: { fontSize: FontSize.sm, color: '#9ca3af', marginTop: Spacing[2] },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
    marginTop: Spacing[3],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  securityText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: '#9ca3af',
    lineHeight: FontSize.sm * 1.5,
  },
  testHint: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginTop: Spacing[2],
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
  momoInfo: {
    backgroundColor: '#e8faf0',
    borderRadius: Radius.xl,
    padding: Spacing[4],
    marginTop: Spacing[4],
  },
  momoText: {
    fontSize: FontSize.base,
    color: Colors.foreground,
    lineHeight: FontSize.base * 1.5,
  },
  payButton: {
    marginBottom: Spacing[4],
    marginTop: Spacing[4],
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
