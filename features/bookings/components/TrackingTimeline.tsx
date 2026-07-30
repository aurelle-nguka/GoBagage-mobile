import { View, Text, StyleSheet } from 'react-native'
import { CheckCircle, RefreshCw, Clock } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { BookingStatus } from '../types/booking.type'

interface TimelineStep {
  status: BookingStatus
  label: string
  sublabel: string
}

const STEPS_ORDER: BookingStatus[] = [
  'ACCEPTED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'CONFIRMED',
]

interface TrackingTimelineProps {
  steps: TimelineStep[]
  currentStatus: BookingStatus
}

export function TrackingTimeline({
  steps,
  currentStatus,
}: TrackingTimelineProps) {
  const { t } = useTranslation()
  const currentIndex = STEPS_ORDER.indexOf(currentStatus)

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('tracking.shipment_status', 'Shipment Status')}
      </Text>

      {steps.map((step, idx) => {
        const stepIndex = STEPS_ORDER.indexOf(step.status)
        const isDone = stepIndex < currentIndex
        const isCurrent = stepIndex === currentIndex
        const isLast = idx === steps.length - 1

        return (
          <View key={step.status} style={styles.row}>
            <View style={styles.connectorColumn}>
              <View
                style={[
                  styles.iconCircle,
                  isDone && styles.iconCircleDone,
                  isCurrent && styles.iconCircleCurrent,
                ]}
              >
                {isDone ? (
                  <CheckCircle size={16} color={Colors.white} />
                ) : isCurrent ? (
                  <RefreshCw size={16} color={Colors.warning} />
                ) : (
                  <Clock size={16} color='#9ca3af' />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.connectorLine,
                    { backgroundColor: isDone ? Colors.primary : '#e5e7eb' },
                  ]}
                />
              )}
            </View>

            <View style={styles.textColumn}>
              <Text
                style={[
                  styles.stepLabel,
                  isDone && styles.stepLabelDone,
                  isCurrent && styles.stepLabelCurrent,
                  !isDone && !isCurrent && styles.stepLabelPending,
                ]}
              >
                {step.label}
              </Text>
              <Text style={styles.stepSublabel}>{step.sublabel}</Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius['2xl'],
    padding: Spacing[4],
    marginBottom: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.mutedForeground,
    marginBottom: Spacing[4],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', gap: Spacing[3] },
  connectorColumn: { alignItems: 'center' },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleDone: { backgroundColor: Colors.primary },
  iconCircleCurrent: {
    backgroundColor: '#fff8e8',
    borderWidth: 2,
    borderColor: Colors.warning,
  },
  connectorLine: { width: 2, flex: 1, minHeight: 24, marginVertical: 4 },
  textColumn: { flex: 1, paddingBottom: Spacing[4] },
  stepLabel: { fontSize: FontSize.base, marginBottom: 2 },
  stepLabelDone: { fontWeight: FontWeight.semibold, color: Colors.primary },
  stepLabelCurrent: { fontWeight: FontWeight.semibold, color: Colors.warning },
  stepLabelPending: { fontWeight: FontWeight.normal, color: '#9ca3af' },
  stepSublabel: { fontSize: FontSize.sm, color: '#9ca3af' },
})
