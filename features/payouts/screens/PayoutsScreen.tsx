import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Wallet, Smartphone, Landmark, CheckCircle2, XCircle } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../../theme'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'
import { ErrorBanner } from '../../../shared/components/feedback/ErrorBanner'
import { formatCAD } from '../../../shared/utils/currency.utils'
import { usePayouts } from '../hooks/usePayouts'
import type { PayoutDTO, PayoutProvider, PayoutStatus } from '../types/payout.types'

interface PayoutsScreenProps {
  onBack: () => void
}

const PROVIDERS: { id: PayoutProvider; labelKey: string; fallback: string; needsPhone: boolean }[] = [
  { id: 'ORANGE', labelKey: 'payouts.provider_orange', fallback: 'Orange Money', needsPhone: true },
  { id: 'MTN', labelKey: 'payouts.provider_mtn', fallback: 'MTN MoMo', needsPhone: true },
  { id: 'INTERAC', labelKey: 'payouts.provider_interac', fallback: 'Interac', needsPhone: false },
  { id: 'BANK_TRANSFER', labelKey: 'payouts.provider_bank', fallback: 'Bank transfer', needsPhone: false },
]

const STATUS_COLORS: Record<PayoutStatus, string> = {
  PENDING: Colors.warning,
  PROCESSING: Colors.warning,
  COMPLETED: Colors.primary,
  FAILED: Colors.destructive,
}

export function PayoutsScreen({ onBack }: PayoutsScreenProps) {
  const { t, i18n } = useTranslation()
  const { balance, payouts, loading, submitting, error, lastResult, submit, clearResult } = usePayouts()
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState<PayoutProvider>('ORANGE')
  const [phone, setPhone] = useState('')
  const [details, setDetails] = useState('')

  const selectedProvider = PROVIDERS.find((p) => p.id === provider)!

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(iso),
    )

  const statusLabel = (status: PayoutStatus) => {
    switch (status) {
      case 'PENDING': return t('payouts.status_pending', 'Pending')
      case 'PROCESSING': return t('payouts.status_processing', 'Processing')
      case 'COMPLETED': return t('payouts.status_completed', 'Completed')
      case 'FAILED': return t('payouts.status_failed', 'Failed')
    }
  }

  const providerLabel = (id: PayoutProvider) => {
    const entry = PROVIDERS.find((p) => p.id === id)
    return t(entry?.labelKey ?? id, entry?.fallback ?? id)
  }

  const handleSubmit = async () => {
    clearResult()
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) return
    if (selectedProvider.needsPhone && !phone.trim()) return
    if (!selectedProvider.needsPhone && !details.trim()) return

    const ok = await submit(
      numericAmount,
      provider,
      selectedProvider.needsPhone ? phone.trim() : undefined,
      selectedProvider.needsPhone ? undefined : details.trim(),
    )
    if (ok) {
      setAmount('')
      setPhone('')
      setDetails('')
    }
  }

  const canSubmit =
    !!Number(amount) &&
    Number(amount) > 0 &&
    (selectedProvider.needsPhone ? !!phone.trim() : !!details.trim())

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={Colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('payouts.title', 'My Earnings')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? <ErrorBanner message={error} /> : null}

        <View style={styles.balanceCard}>
          <Wallet size={26} color='#FFD600' />
          <Text style={styles.balanceLabel}>{t('payouts.balance_available', 'Available balance')}</Text>
          <Text style={styles.balanceAmount}>{formatCAD(balance?.availableCad ?? 0)}</Text>
        </View>

        {lastResult && (
          <View
            style={[
              styles.resultBanner,
              { backgroundColor: lastResult.status === 'COMPLETED' ? '#e8faf0' : '#fef2f2' },
            ]}
          >
            {lastResult.status === 'COMPLETED' ? (
              <CheckCircle2 size={18} color={Colors.primary} />
            ) : (
              <XCircle size={18} color={Colors.destructive} />
            )}
            <Text style={styles.resultText}>
              {lastResult.status === 'COMPLETED'
                ? t('payouts.success_message', 'Payout of {{amount}} sent successfully', {
                    amount: formatCAD(lastResult.amountCad),
                  })
                : t('payouts.failure_message', 'Payout failed: {{reason}}', {
                    reason: lastResult.failureReason ?? '',
                  })}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('payouts.amount_label', 'Amount to withdraw (CAD)')}</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder={t('payouts.amount_placeholder', '0.00')}
            placeholderTextColor='#9ca3af'
            keyboardType='decimal-pad'
            style={styles.input}
          />

          <Text style={[styles.sectionLabel, { marginTop: Spacing[4] }]}>
            {t('payouts.provider_label', 'Choose a withdrawal method')}
          </Text>
          <View style={styles.providerGrid}>
            {PROVIDERS.map(({ id, labelKey, fallback, needsPhone }) => {
              const isSelected = id === provider
              const Icon = needsPhone ? Smartphone : Landmark
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.providerChip, isSelected && styles.providerChipActive]}
                  onPress={() => setProvider(id)}
                  activeOpacity={0.85}
                >
                  <Icon size={16} color={isSelected ? Colors.white : Colors.foreground} />
                  <Text style={[styles.providerLabel, isSelected && styles.providerLabelActive]}>
                    {t(labelKey, fallback)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {selectedProvider.needsPhone ? (
            <>
              <Text style={[styles.sectionLabel, { marginTop: Spacing[4] }]}>
                {t('payouts.phone_label', 'Phone number')}
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder={t('payouts.phone_placeholder', '+237 6XX XXX XXX')}
                placeholderTextColor='#9ca3af'
                keyboardType='phone-pad'
                style={styles.input}
              />
            </>
          ) : (
            <>
              <Text style={[styles.sectionLabel, { marginTop: Spacing[4] }]}>
                {t('payouts.details_label', 'Bank details')}
              </Text>
              <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder={t(
                  'payouts.details_placeholder',
                  'Account holder name, IBAN/account number, bank',
                )}
                placeholderTextColor='#9ca3af'
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </>
          )}

          <PrimaryButton
            label={t('payouts.withdraw_button', 'Withdraw')}
            loadingLabel={t('payment.processing')}
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            style={{ marginTop: Spacing[4] }}
          />
        </View>

        <Text style={styles.sectionTitleStandalone}>{t('payouts.history_title', 'Withdrawal history')}</Text>
        {payouts.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyText}>{t('payouts.no_history', 'No withdrawals yet')}</Text>
          </View>
        ) : (
          payouts.map((payout: PayoutDTO) => (
            <View key={payout.id} style={styles.historyRow}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyAmount}>{formatCAD(payout.amountCad)}</Text>
                <Text style={styles.historyMeta}>
                  {providerLabel(payout.provider)} · {formatDate(payout.requestedAt)}
                </Text>
                {payout.status === 'FAILED' && payout.failureReason && (
                  <Text style={styles.historyFailureReason}>{payout.failureReason}</Text>
                )}
                {payout.status === 'COMPLETED' && payout.reference && (
                  <Text style={styles.historyReference}>{payout.reference}</Text>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[payout.status] }]}>
                <Text style={styles.statusBadgeText}>{statusLabel(payout.status)}</Text>
              </View>
            </View>
          ))
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
  balanceCard: {
    backgroundColor: '#2C3E50',
    borderRadius: Radius['2xl'],
    padding: Spacing[6],
    alignItems: 'center',
    marginBottom: Spacing[4],
    gap: 4,
  },
  balanceLabel: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.8)', marginTop: Spacing[2] },
  balanceAmount: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, color: Colors.white },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[2],
    borderRadius: Radius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  resultText: { flex: 1, fontSize: FontSize.sm, color: Colors.foreground, lineHeight: FontSize.sm * 1.5 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
  },
  sectionLabel: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.foreground, marginBottom: Spacing[2] },
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
  textArea: { textAlignVertical: 'top', minHeight: 80 },
  providerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2] },
  providerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: Radius.xl,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
  },
  providerChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  providerLabel: { fontSize: FontSize.sm, color: Colors.foreground, fontWeight: FontWeight.medium },
  providerLabelActive: { color: Colors.white, fontWeight: FontWeight.bold },
  sectionTitleStandalone: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
  },
  emptyHistory: { alignItems: 'center', paddingVertical: Spacing[6] },
  emptyText: { color: '#9ca3af', fontSize: FontSize.base },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  historyInfo: { flex: 1 },
  historyAmount: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.foreground },
  historyMeta: { fontSize: FontSize.sm, color: Colors.mutedForeground, marginTop: 2 },
  historyFailureReason: { fontSize: FontSize.xs, color: Colors.destructive, marginTop: 2 },
  historyReference: { fontSize: FontSize.xs, color: '#9ca3af', marginTop: 2 },
  statusBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusBadgeText: { color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold },
})
