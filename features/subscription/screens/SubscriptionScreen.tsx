import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Crown, Lock, Gift } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { CardField, type CardFieldInput } from '@stripe/stripe-react-native'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { useSubscription } from '../hooks/useSubscription'

interface SubscriptionScreenProps {
  onBack: () => void
}

export function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const { t, i18n } = useTranslation()
  const { status, launchOffer, loading, actionLoading, error, doSubscribe, doCancel, doApplyPromo } =
    useSubscription()
  const [cardComplete, setCardComplete] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </SafeAreaView>
    )
  }

  const isActive = status?.active ?? false
  const showLaunchOffer =
    !!launchOffer?.available && !status?.launchOfferApplied && !isActive

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(iso),
    )

  const handleSubscribe = async () => {
    if (!cardComplete) {
      Alert.alert(
        t('payment.card_incomplete', 'Incomplete card'),
        t('payment.card_incomplete_msg', 'Please fill in all card details.'),
      )
      return
    }
    await doSubscribe()
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    const ok = await doApplyPromo(promoCode.trim())
    if (ok) setPromoCode('')
  }

  const handleCancel = () => {
    Alert.alert(
      t('subscription.cancel_confirm_title', 'Cancel subscription'),
      t('subscription.cancel_confirm_msg', 'Are you sure you want to cancel your Premium subscription?'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.confirm'), style: 'destructive', onPress: () => doCancel() },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('subscription.title', 'Go Bagage Premium')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? <ErrorBanner message={error} /> : null}

        <View style={styles.statusCard}>
          <Crown size={28} color={isActive ? '#FFD600' : 'rgba(255,255,255,0.5)'} />
          <Text style={styles.statusTitle}>
            {isActive
              ? t('subscription.status_active', 'Premium Active')
              : t('subscription.status_free', 'Free Plan')}
          </Text>
          {isActive && status?.daysRemaining != null && (
            <Text style={styles.statusSubtitle}>
              {t('subscription.days_remaining', '{{count}} days remaining', {
                count: status.daysRemaining,
              })}
            </Text>
          )}
          {isActive && status?.endDate && (
            <Text style={styles.statusMeta}>
              {t('subscription.renews_on', 'Ends on {{date}}', { date: formatDate(status.endDate) })}
            </Text>
          )}
        </View>

        {showLaunchOffer && (
          <View style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <Gift size={20} color={Colors.primary} />
              <Text style={styles.offerTitle}>
                {t('subscription.launch_offer_title', 'Launch Offer')}
              </Text>
            </View>
            <Text style={styles.offerSubtitle}>
              {t('subscription.launch_offer_subtitle', {
                defaultValue: '{{count}} spots left · Ends {{date}}',
                count: launchOffer?.remainingSlots ?? 0,
                date: launchOffer?.offerEndDate ? formatDate(launchOffer.offerEndDate) : '',
              })}
            </Text>
            <View style={styles.promoRow}>
              <TextInput
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder={t('subscription.promo_placeholder', 'Enter promo code')}
                placeholderTextColor='#9ca3af'
                autoCapitalize='characters'
                style={styles.promoInput}
              />
              <TouchableOpacity
                style={styles.promoButton}
                onPress={handleApplyPromo}
                disabled={actionLoading || !promoCode.trim()}
                activeOpacity={0.85}
              >
                <Text style={styles.promoButtonText}>{t('subscription.apply_promo', 'Apply')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isActive && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('payment.card_details', 'Card Information')}</Text>
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
                {t('payment.card_hint', 'Enter your card number, expiry date and CVV')}
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

            <PrimaryButton
              label={t('subscription.subscribe_button', 'Subscribe — $35 CAD/year')}
              loadingLabel={t('payment.processing')}
              loading={actionLoading}
              disabled={!cardComplete}
              onPress={handleSubscribe}
              style={{ marginTop: Spacing[4] }}
            />
          </View>
        )}

        {isActive && (
          <TouchableOpacity
            style={styles.cancelLink}
            onPress={handleCancel}
            disabled={actionLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelLinkText}>
              {t('subscription.cancel_button', 'Cancel subscription')}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.foreground },
  scrollContent: { paddingHorizontal: Spacing[5], paddingVertical: Spacing[5] },
  statusCard: {
    backgroundColor: '#2C3E50',
    borderRadius: Radius['2xl'],
    padding: Spacing[6],
    alignItems: 'center',
    marginBottom: Spacing[4],
    gap: 4,
  },
  statusTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.white, marginTop: Spacing[2] },
  statusSubtitle: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.8)' },
  statusMeta: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)' },
  offerCard: {
    backgroundColor: '#e8faf0',
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  offerHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], marginBottom: Spacing[1] },
  offerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.foreground },
  offerSubtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground, marginBottom: Spacing[3] },
  promoRow: { flexDirection: 'row', gap: Spacing[2] },
  promoInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: Spacing[3],
    fontSize: FontSize.base,
    color: Colors.foreground,
  },
  promoButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[3],
  },
  sectionLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.foreground, marginBottom: Spacing[3] },
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
  cancelLink: { alignItems: 'center', paddingVertical: Spacing[4] },
  cancelLinkText: { color: Colors.destructive, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
})
