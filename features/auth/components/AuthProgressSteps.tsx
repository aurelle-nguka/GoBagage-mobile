import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontWeight, Radius, Spacing } from '../../../theme'

interface AuthProgressStepsProps {
  currentStep: 0 | 1 | 2
}

export function AuthProgressSteps({ currentStep }: AuthProgressStepsProps) {
  const { t } = useTranslation()

  const STEPS = [
    t('auth.step_account', 'Account'),
    t('auth.step_verify', 'Verify'),
    t('auth.step_identity', 'Identity'),
  ]

  return (
    <View style={styles.row}>
      {STEPS.map((label, i) => {
        const isDoneOrActive = i <= currentStep
        return (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.bar,
                {
                  backgroundColor: isDoneOrActive ? Colors.primary : '#e5e7eb',
                },
              ]}
            />
            <Text
              style={[
                styles.label,
                { color: isDoneOrActive ? Colors.primary : '#9ca3af' },
              ]}
            >
              {label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing[2], marginBottom: Spacing[6] },
  stepItem: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: '100%', height: 4, borderRadius: Radius.full },
  label: { fontSize: 10, fontWeight: FontWeight.medium },
})
