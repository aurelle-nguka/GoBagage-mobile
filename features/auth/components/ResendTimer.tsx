import { useEffect, useState, useRef } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { OTP_RESEND_DELAY } from '../../../shared/constants/app.constants'

interface ResendTimerProps {
  onResend: () => void
  resetKey?: number
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ResendTimer({ onResend, resetKey = 0 }: ResendTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(OTP_RESEND_DELAY)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSecondsLeft(OTP_RESEND_DELAY)

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [resetKey])

  const canResend = secondsLeft === 0

  const handlePress = () => {
    if (!canResend) return
    onResend()
    setSecondsLeft(OTP_RESEND_DELAY)
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={!canResend}
      activeOpacity={canResend ? 0.7 : 1}
    >
      {canResend ? (
        <Text style={styles.resendText}>
          Didn't receive a code?{' '}
          <Text style={styles.resendHighlight}>Resend</Text>
        </Text>
      ) : (
        <Text style={styles.waitingText}>
          Resend code in{' '}
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing[2],
    marginTop: Spacing[4],
    alignItems: 'center',
  },
  resendText: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
  },
  resendHighlight: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  waitingText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
  },
  timerText: {
    color: Colors.foreground,
    fontWeight: FontWeight.semibold,
  },
})
