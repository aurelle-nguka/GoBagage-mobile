import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Clock } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { PrimaryButton } from '../../../shared/components/ui/PrimaryButton'

interface KycPendingScreenProps {
  onContinue: () => void
}

export function KycPendingScreen({ onContinue }: KycPendingScreenProps) {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Clock size={48} color={Colors.warning} />
        </View>

        <Text style={styles.title}>
          {t('kyc.pending_title', 'Verification Pending')}
        </Text>
        <Text style={styles.description}>
          {t(
            'kyc.pending_desc',
            "Our team is reviewing your documents. This usually takes 1–24 hours. We'll notify you once verified.",
          )}
        </Text>

        <View style={styles.statusBanner}>
          <Clock size={22} color={Colors.warning} />
          <View>
            <Text style={styles.statusTitle}>
              {t('kyc.pending_status', 'Pending verification')}
            </Text>
            <Text style={styles.statusSubtitle}>
              {t('kyc.submitted_success', 'Documents submitted successfully')}
            </Text>
          </View>
        </View>

        <PrimaryButton
          label={t('kyc.continue_app', 'Continue to App')}
          onPress={onContinue}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[8],
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: '#fff8e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[2],
  },
  description: {
    color: Colors.mutedForeground,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
    maxWidth: 280,
    marginBottom: Spacing[8],
  },
  statusBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    backgroundColor: '#fff8e8',
    borderWidth: 1,
    borderColor: '#ffe0b2',
    borderRadius: Radius.xl,
    padding: Spacing[4],
    marginBottom: Spacing[6],
  },
  statusTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#E65100',
  },
  statusSubtitle: { fontSize: FontSize.sm, color: Colors.mutedForeground },
  continueButton: { width: '100%' },
})
