import { useCallback, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { User } from '../../types/user.types'
import { useAuthStore } from '../../store/auth.store'
import { Colors } from '../../theme/colors'
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen'
import { getMyProfile } from '../../features/auth/api/auth.api'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, setUser } = useAuthStore()
  const [refreshing, setRefreshing] = useState(false)

  const loadProfile = useCallback(async () => {
    try {
      const userDto = await getMyProfile()
      const updatedUser: User = {
        id: userDto.id,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        email: userDto.email,
        phone: userDto.phone,
        roles: userDto.roles,
        kycStatus: userDto.kycStatus,
        kycRejectionReason: userDto.kycRejectionReason ?? undefined,
        profilePhoto: userDto.profilePhotoUrl ?? undefined,
        bio: userDto.bio ?? undefined,
        averageRating: userDto.averageRating ?? 0,
        totalDeliveries: userDto.totalDeliveries,
        subscriptionType: userDto.subscriptionPlan,
        createdAt: userDto.createdAt,
      }
      setUser(updatedUser)
    } catch (err) {}
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadProfile()
    setRefreshing(false)
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  return (
    <ProfileScreen
      user={user}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onBack={() => router.back()}
      onGoToKyc={() => router.push('/(auth)/kyc')}
      onSeeAllActivity={() => router.push('/(modals)/activity')}
      onOpenActivity={(bookingId) =>
        router.push(`/(modals)/tracking/${bookingId}`)
      }
      onPaymentMethods={() => {}}
      onNotificationSettings={() => {}}
      onLanguageSettings={() => router.push('/(modals)/language')}
      onEditProfile={() => router.push('/(modals)/edit-profile')}
      onLogout={async () => {
        await logout()
        router.replace('/(auth)/onboarding')
      }}
    />
  )
}
