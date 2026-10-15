import { useState, useCallback } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { CreditCard, Bell, Globe, ShieldCheck } from 'lucide-react-native'
import { Colors, FontSize, FontWeight, Spacing } from '../../../theme'
import { ProfileHeader } from '../components/ProfileHeader'
import { KycStatusBanner } from '../components/KycStatusBanner'
import { ProfileStatsRow } from '../components/ProfileStatsRow'
import { SubscriptionCard } from '../components/SubscriptionCard'
import {
  RecentActivityRow,
  type ActivityItem,
} from '../components/RecentActivityRow'
import { SettingsList, type SettingsItem } from '../components/SettingsList'
import { LogoutButton } from '../components/LogoutButton'
import type { User } from '../../../types/user.types'
import apiClient from '../../../shared/services/api.client'

interface ProfileScreenProps {
  user: User
  onBack: () => void
  onSeeAllActivity: () => void
  onOpenActivity: (id: string) => void
  onGoToKyc: () => void
  onPaymentMethods: () => void
  onNotificationSettings: () => void
  onLanguageSettings: () => void
  onLogout: () => void
  onRefresh: () => void
  refreshing: boolean
  onEditProfile: () => void
}

export function ProfileScreen({
  user,
  onBack,
  onSeeAllActivity,
  onOpenActivity,
  onGoToKyc,
  onPaymentMethods,
  onNotificationSettings,
  onLanguageSettings,
  onLogout,
  onRefresh,
  refreshing,
  onEditProfile,
}: ProfileScreenProps) {
  const { t, i18n } = useTranslation()

  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [tripsCount, setTripsCount] = useState(0)
  const [parcelsSent, setParcelsSent] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)

  const LANG_LABELS: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    zh: '中文',
  }

  const loadStats = useCallback(async () => {
    setLoadingStats(true)
    try {
      const response = await apiClient.get('/bookings')
      const raw = Array.isArray(response.data)
        ? response.data
        : (response.data?.content ?? [])

      const isTraveler = user.roles.includes('TRAVELER')
      const isSender = user.roles.includes('SENDER')

      const completedBookings = raw.filter(
        (b: any) => b.status === 'CONFIRMED' || b.status === 'DELIVERED',
      )

      setTripsCount(
        isTraveler
          ? completedBookings.filter((b: any) => b.travelerId === user.id)
              .length
          : 0,
      )

      setParcelsSent(
        isSender
          ? completedBookings.filter((b: any) => b.senderId === user.id).length
          : 0,
      )

      setTotalEarnings(
        isTraveler
          ? completedBookings.reduce(
              (sum: number, b: any) => sum + (b.travelerAmountCad ?? 0),
              0,
            )
          : 0,
      )

      const mapped: ActivityItem[] = raw.slice(0, 5).map((b: any) => {
        const corridor = b.trip?.corridor
        const unknown = t('common.unknown', 'Unknown')
        const from = corridor?.departureCity ?? unknown
        const to = corridor?.arrivalCity ?? unknown
        const isEarning = isTraveler && b.travelerAmountCad > 0

        return {
          id: String(b.id),
          type: isTraveler ? 'trip' : 'parcel',
          from,
          to,
          amount: isEarning ? b.travelerAmountCad : -(b.totalAmountCad ?? 0),
          date: b.createdAt
            ? new Intl.DateTimeFormat(i18n.language, {
                month: 'short',
                day: 'numeric',
              }).format(new Date(b.createdAt))
            : '—',
          status: b.status ?? 'PENDING',
        }
      })

      setActivities(mapped)
    } catch {
    } finally {
      setLoadingStats(false)
    }
  }, [user, i18n.language])

  useFocusEffect(
    useCallback(() => {
      loadStats()
    }, [loadStats]),
  )

  const initials =
    `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
  const fullName = `${user.firstName} ${user.lastName}`
  const memberSince = new Intl.DateTimeFormat(i18n.language, {
    month: 'short',
    year: 'numeric',
  }).format(new Date(user.createdAt))
  const kycIsVerified = user.kycStatus === 'VERIFIED'

  const settingsItems: SettingsItem[] = [
    {
      id: 'kyc',
      Icon: ShieldCheck,
      label: t('profile.kyc'),
      color: kycIsVerified ? Colors.primary : Colors.warning,
      value: kycIsVerified
        ? t('profile.kyc_verified')
        : t('profile.kyc_required'),
      valueColor: kycIsVerified ? Colors.primary : Colors.warning,
      onPress: onGoToKyc,
    },
    {
      id: 'payment',
      Icon: CreditCard,
      label: t('profile.payment_methods'),
      color: Colors.secondary,
      onPress: onPaymentMethods,
    },
    {
      id: 'notifications',
      Icon: Bell,
      label: t('profile.notifications'),
      color: Colors.warning,
      onPress: onNotificationSettings,
    },
    {
      id: 'language',
      Icon: Globe,
      label: t('profile.language'),
      color: '#9C27B0',
      value: LANG_LABELS[i18n.language] ?? 'English',
      onPress: onLanguageSettings,
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader
        initials={initials}
        name={fullName}
        bio={user.bio}
        memberSince={memberSince}
        averageRating={user.averageRating}
        isVerified={kycIsVerified}
        onBack={onBack}
        onEdit={onEditProfile}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {!kycIsVerified && (
          <KycStatusBanner
            status={user.kycStatus}
            rejectionReason={user.kycRejectionReason}
            onGoToKyc={onGoToKyc}
          />
        )}

        {loadingStats ? (
          <ActivityIndicator
            size='small'
            color={Colors.primary}
            style={{ marginVertical: Spacing[4] }}
          />
        ) : (
          <ProfileStatsRow
            tripsCount={tripsCount}
            parcelsSentCount={parcelsSent}
            totalEarnings={totalEarnings}
          />
        )}

        <SubscriptionCard plan={user.subscriptionType} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('profile.recent_activity')}
          </Text>
          <Text style={styles.seeAll} onPress={onSeeAllActivity}>
            {t('home.see_all')}
          </Text>
        </View>

        {loadingStats ? (
          <ActivityIndicator size='small' color={Colors.primary} />
        ) : activities.length === 0 ? (
          <View style={styles.emptyActivity}>
            <Text style={styles.emptyText}>{t('profile.no_activity')}</Text>
          </View>
        ) : (
          activities.map((activity) => (
            <RecentActivityRow
              key={activity.id}
              activity={activity}
              onPress={() => onOpenActivity(activity.id)}
            />
          ))
        )}

        <Text style={styles.sectionTitleStandalone}>
          {t('profile.settings')}
        </Text>
        <SettingsList items={settingsItems} />

        <LogoutButton onPress={onLogout} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[5], paddingTop: Spacing[5] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  sectionTitleStandalone: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[3],
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: Spacing[6],
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: FontSize.base,
  },
})
