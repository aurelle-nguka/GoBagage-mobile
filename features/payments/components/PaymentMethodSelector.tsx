import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import Svg, { Rect, Circle, Path, Text as SvgText } from 'react-native-svg'
import { Check } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import type { PaymentProvider } from '../types/payment.types'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { JSX } from 'react/jsx-runtime'

function StripeIcon() {
  return (
    <Svg width={36} height={24} viewBox='0 0 36 24'>
      <Rect width={36} height={24} rx={4} fill='#635BFF' />
      <Path
        d='M18 7c-1.8 0-3.2 1.2-3.2 2.8 0 2.8 3.8 2.4 3.8 4 0 .6-.5 1-1.3 1-.8 0-1.8-.4-2.5-.9v2.2c.7.4 1.6.6 2.5.6 2 0 3.3-1.1 3.3-2.8 0-2.9-3.8-2.5-3.8-4 0-.6.5-.9 1.2-.9.8 0 1.6.3 2.3.8V7.4C19.6 7.1 18.8 7 18 7z'
        fill='white'
      />
    </Svg>
  )
}

function OrangeMoneyIcon() {
  return (
    <Svg width={36} height={36} viewBox='0 0 36 36'>
      <Circle cx={18} cy={18} r={18} fill='#FF6600' />
      <SvgText
        x={18}
        y={23}
        textAnchor='middle'
        fill='white'
        fontSize={14}
        fontWeight='bold'
      >
        OM
      </SvgText>
    </Svg>
  )
}

function MtnMomoIcon() {
  return (
    <Svg width={36} height={36} viewBox='0 0 36 36'>
      <Circle cx={18} cy={18} r={18} fill='#FFCC00' />
      <SvgText
        x={18}
        y={23}
        textAnchor='middle'
        fill='#1A1A1A'
        fontSize={11}
        fontWeight='bold'
      >
        MoMo
      </SvgText>
    </Svg>
  )
}

function InteracIcon() {
  return (
    <Svg width={36} height={24} viewBox='0 0 36 24'>
      <Rect width={36} height={24} rx={4} fill='#FFD100' />
      <SvgText
        x={18}
        y={16}
        textAnchor='middle'
        fill='#1A1A1A'
        fontSize={9}
        fontWeight='bold'
      >
        Interac
      </SvgText>
    </Svg>
  )
}

interface PaymentMethodConfig {
  provider: PaymentProvider
  label: string
  sublabel: string
  Icon: () => JSX.Element
}

function getPaymentMethods(
  t: (key: string, fallback: string) => string,
): PaymentMethodConfig[] {
  return [
    {
      provider: 'STRIPE',
      label: t('payment.method_stripe_label', 'Credit / Debit Card'),
      sublabel: t('payment.method_stripe_sublabel', 'Visa, Mastercard, Amex'),
      Icon: StripeIcon,
    },
    {
      provider: 'ORANGE_MONEY',
      label: t('payment.method_orange_label', 'Orange Money'),
      sublabel: t(
        'payment.method_orange_sublabel',
        'Mobile money · Cameroun, CI...',
      ),
      Icon: OrangeMoneyIcon,
    },
    {
      provider: 'MTN_MOMO',
      label: t('payment.method_momo_label', 'MTN MoMo'),
      sublabel: t(
        'payment.method_momo_sublabel',
        'Mobile money · Cameroun, GH...',
      ),
      Icon: MtnMomoIcon,
    },
    {
      provider: 'INTERAC',
      label: t('payment.method_interac_label', 'Interac e-Transfer'),
      sublabel: t('payment.method_interac_sublabel', 'Canadian banks only'),
      Icon: InteracIcon,
    },
  ]
}

interface PaymentMethodSelectorProps {
  selected: PaymentProvider
  onSelect: (provider: PaymentProvider) => void
}

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation()
  const paymentMethods = getPaymentMethods(t)

  return (
    <View style={styles.list}>
      {paymentMethods.map((method) => {
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
            <View style={styles.iconWrapper}>
              <method.Icon />
            </View>
            <View style={styles.labelBlock}>
              <Text style={styles.label}>{method.label}</Text>
              <Text style={styles.sublabel}>{method.sublabel}</Text>
            </View>
            <View style={[styles.radio, isActive && styles.radioActive]}>
              {isActive && <Check size={12} color={Colors.white} />}
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
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBlock: { flex: 1 },
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
})
