import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CheckCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { RouteLabel } from '../../../shared/components/ui/RouteLabel'

interface PaymentSuccessScreenProps {
  amount: number
  from: string
  to: string
  travelerName: string
  onTrack: () => void
}

export function PaymentSuccessScreen({
  amount,
  from,
  to,
  travelerName,
  onTrack,
}: PaymentSuccessScreenProps) {
  const { t } = useTranslation()
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[styles.iconCircle, { transform: [{ scale: scaleAnim }] }]}
        >
          <CheckCircle size={64} color={Colors.primary} />
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity: opacityAnim }]}>
          <Text style={styles.title}>{t('payment.success')}</Text>
          <Text style={styles.subtitle}>{t('payment.success_subtitle')}</Text>

          <View style={styles.summaryCard}>
            <Row
              label={t('payment.amount_paid')}
              value={`$${amount.toFixed(2)} CAD`}
              highlight
            />
            <Row label={t('payment.traveler')} value={travelerName} />
            <View style={styles.routeRow}>
              <Text style={styles.rowLabel}>{t('payment.route')}</Text>
              <RouteLabel from={from} to={to} size='sm' />
            </View>
            <Row label={t('payment.status')} value={t('payment.awaiting')} />
          </View>

          <PrimaryButton
            label={t('payment.track')}
            onPress={onTrack}
            style={styles.trackButton}
          />

          <Text style={styles.note}>
            {t(
              'payment.notify_note',
              'You will be notified once the traveler accepts your booking.',
            )}
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  textBlock: { width: '100%', alignItems: 'center' },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.5,
    marginBottom: Spacing[6],
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    marginBottom: Spacing[6],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  rowLabel: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  rowValue: {
    fontSize: FontSize.sm,
    color: Colors.foreground,
    fontWeight: FontWeight.medium,
  },
  rowValueHighlight: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.base,
  },
  trackButton: { width: '100%', marginBottom: Spacing[3] },
  note: { fontSize: FontSize.sm, color: '#9ca3af', textAlign: 'center' },
})
