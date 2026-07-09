import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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

// TODO: remplacer par features/profile/hooks/useProfile() → GET /payments/history
const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'trip',
    label: 'Trip: Montreal → Douala',
    amount: 168,
    date: 'Jun 13',
    status: 'Completed',
  },
  {
    id: '2',
    type: 'parcel',
    label: 'Parcel sent to Paris',
    amount: -84,
    date: 'May 28',
    status: 'Delivered',
  },
  {
    id: '3',
    type: 'trip',
    label: 'Trip: Toronto → Abidjan',
    amount: 220,
    date: 'May 10',
    status: 'Completed',
  },
]

interface ProfileScreenProps {
  user: User
  tripsCount: number
  parcelsSentCount: number
  totalEarnings: number
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
}

export function ProfileScreen({
  user,
  tripsCount,
  parcelsSentCount,
  totalEarnings,
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
}: ProfileScreenProps) {
  const initials =
    `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
  const fullName = `${user.firstName} ${user.lastName}`
  const memberSince = new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(user.createdAt))

  const kycIsVerified = user.kycStatus === 'VERIFIED'

  const settingsItems: SettingsItem[] = [
    {
      id: 'kyc',
      Icon: ShieldCheck,
      label: 'Identity Verification (KYC)',
      color: kycIsVerified ? Colors.primary : Colors.warning,
      value: kycIsVerified ? 'Verified' : '⚠️ Required',
      onPress: onGoToKyc,
    },
    {
      id: 'payment',
      Icon: CreditCard,
      label: 'Payment Methods',
      color: Colors.secondary,
      onPress: onPaymentMethods,
    },
    {
      id: 'notifications',
      Icon: Bell,
      label: 'Notifications',
      color: Colors.warning,
      onPress: onNotificationSettings,
    },
    {
      id: 'language',
      Icon: Globe,
      label: 'Language',
      color: '#9C27B0',
      value: 'English',
      onPress: onLanguageSettings,
    },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProfileHeader
        initials={initials}
        name={fullName}
        memberSince={memberSince}
        averageRating={user.averageRating}
        isVerified={kycIsVerified}
        onBack={onBack}
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

        <ProfileStatsRow
          tripsCount={tripsCount}
          parcelsSentCount={parcelsSentCount}
          totalEarnings={totalEarnings}
        />

        <SubscriptionCard plan={user.subscriptionType} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.seeAll} onPress={onSeeAllActivity}>
            See all
          </Text>
        </View>

        {MOCK_ACTIVITY.map((activity) => (
          <RecentActivityRow
            key={activity.id}
            activity={activity}
            onPress={() => onOpenActivity(activity.id)}
          />
        ))}

        <Text style={styles.sectionTitleStandalone}>Settings</Text>
        <SettingsList items={settingsItems} />

        <LogoutButton onPress={onLogout} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
  },
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
})
