import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Package,
  TrendingUp,
  Shield,
  ChevronRight,
  ArrowRight,
  Plane,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

type OnboardingStep = 'slides' | 'role'
type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

interface OnboardingScreenProps {
  onComplete: (role: RoleChoice) => void
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<OnboardingStep>('slides')
  const [slideIndex, setSlideIndex] = useState(0)

  const handleNext = () => {
    if (slideIndex < 2) setSlideIndex(slideIndex + 1)
    else setStep('role')
  }

  if (step === 'role') return <RoleSelector onSelect={onComplete} />

  return (
    <SlidesView
      slideIndex={slideIndex}
      onNext={handleNext}
      onSkip={() => setStep('role')}
    />
  )
}

function SlidesView({
  slideIndex,
  onNext,
  onSkip,
}: {
  slideIndex: number
  onNext: () => void
  onSkip: () => void
}) {
  const { t } = useTranslation()
  const isLast = slideIndex === 2

  const SLIDES = [
    {
      Icon: Package,
      color: Colors.primary,
      title: t('onboarding.slide1_title', 'Send packages\nwith travelers'),
      description: t(
        'onboarding.slide1_desc',
        'Connect with real travelers flying your route. Your parcels travel safely with verified people — faster and cheaper than traditional shipping.',
      ),
      bg: '#e8faf0',
    },
    {
      Icon: TrendingUp,
      color: Colors.secondary,
      title: t('onboarding.slide2_title', 'Earn from\nempty luggage'),
      description: t(
        'onboarding.slide2_desc',
        'Travelling internationally? Monetize your unused luggage allowance. Set your price, choose what you carry, and earn on every trip.',
      ),
      bg: '#e8f4fd',
    },
    {
      Icon: Shield,
      color: Colors.warning,
      title: t('onboarding.slide3_title', 'Secure escrow\npayment'),
      description: t(
        'onboarding.slide3_desc',
        'Payments are held safely in escrow until delivery is confirmed. No risk for senders, guaranteed payment for travelers.',
      ),
      bg: '#fff8e8',
    },
  ]

  const { Icon, color, title, description, bg } = SLIDES[slideIndex]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipRow}>
        <TouchableOpacity
          onPress={onSkip}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.skipText}>{t('common.skip', 'Skip')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContent}>
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <Icon size={56} color={color} strokeWidth={1.5} />
        </View>
        <Text style={styles.slideTitle}>{title}</Text>
        <Text style={styles.slideDescription}>{description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === slideIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {isLast
              ? t('common.get_started', 'Get Started')
              : t('common.next', 'Next')}
          </Text>
          <ChevronRight size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function RoleSelector({ onSelect }: { onSelect: (role: RoleChoice) => void }) {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.roleContent}>
        <View style={styles.roleHeader}>
          <View style={styles.roleIconContainer}>
            <Plane size={32} color={Colors.primary} />
          </View>
          <Text style={styles.roleTitle}>{t('onboarding.title')}</Text>
          <Text style={styles.roleSubtitle}>{t('onboarding.subtitle')}</Text>
        </View>

        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={styles.rolePrimaryButton}
            onPress={() => onSelect('SENDER')}
            activeOpacity={0.85}
          >
            <Text style={styles.rolePrimaryButtonTitle}>
              {t('onboarding.sender')}
            </Text>
            <Text style={styles.rolePrimaryButtonSubtitle}>
              {t('onboarding.sender_subtitle')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleOutlineButton}
            onPress={() => onSelect('TRAVELER')}
            activeOpacity={0.85}
          >
            <Text style={styles.roleOutlineButtonTitle}>
              {t('onboarding.traveler')}
            </Text>
            <Text style={styles.roleOutlineButtonSubtitle}>
              {t('onboarding.traveler_subtitle')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleTextButton}
            onPress={() => onSelect('BOTH')}
            activeOpacity={0.7}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Text style={styles.roleTextButtonLabel}>
                {t('onboarding.both')}
              </Text>
              <ArrowRight size={14} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.legalText}>
        {t(
          'onboarding.legal',
          'By continuing you agree to our Terms of Service & Privacy Policy',
        )}
      </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  skipRow: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[4],
  },
  skipText: {
    color: Colors.mutedForeground,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: Radius['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[8],
  },
  slideTitle: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    textAlign: 'center',
    lineHeight: FontSize['3xl'] * 1.3,
    marginBottom: Spacing[4],
  },
  slideDescription: {
    color: Colors.mutedForeground,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.6,
  },
  footer: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[12],
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[8],
  },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  dotInactive: { width: 8, backgroundColor: '#d1d5db' },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  roleContent: {
    flex: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[16],
  },
  roleHeader: {
    alignItems: 'center',
    marginBottom: Spacing[10],
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius['2xl'],
    backgroundColor: '#e8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  roleTitle: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    textAlign: 'center',
    marginBottom: Spacing[2],
  },
  roleSubtitle: {
    color: Colors.mutedForeground,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.5,
  },
  roleButtons: { gap: Spacing[4] },
  rolePrimaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
  },
  rolePrimaryButtonTitle: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  rolePrimaryButtonSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  roleOutlineButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    alignItems: 'center',
    backgroundColor: Colors.transparent,
  },
  roleOutlineButtonTitle: {
    color: Colors.primary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  roleOutlineButtonSubtitle: {
    color: Colors.mutedForeground,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  roleTextButton: {
    paddingVertical: Spacing[3],
    alignItems: 'center',
  },
  roleTextButtonLabel: {
    color: Colors.foreground,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  legalText: {
    textAlign: 'center',
    color: Colors.mutedForeground,
    fontSize: FontSize.xs,
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[6],
  },
})
