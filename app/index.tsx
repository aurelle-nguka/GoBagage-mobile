import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../store/auth.store'
import { tokenService } from '../shared/services/token.service'
import { getMyProfile } from '../features/auth/api/auth.api'
import { User } from '../types/user.types'
import { Colors } from '../theme/colors'

export default function Index() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  useEffect(() => {
    const bootstrap = async () => {
      const token = await tokenService.getAccessToken()

      if (!token) {
        router.replace('/(auth)/onboarding')
        return
      }

      try {
        const userDto = await getMyProfile()

        const user: User = {
          id: userDto.id,
          firstName: userDto.firstName,
          lastName: userDto.lastName,
          email: userDto.email,
          phone: userDto.phone,
          roles: userDto.roles,
          kycStatus: userDto.kycStatus,
          profilePhoto: userDto.profilePhotoUrl ?? undefined,
          bio: userDto.bio ?? undefined,
          averageRating: userDto.averageRating ?? 0,
          totalDeliveries: userDto.totalDeliveries,
          subscriptionType: userDto.subscriptionPlan,
          createdAt: userDto.createdAt,
        }

        setUser(user)
        router.replace('/(tabs)/')
      } catch {
        await tokenService.clearTokens()
        router.replace('/(auth)/onboarding')
      }
    }

    bootstrap()
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
      }}
    >
      <ActivityIndicator size='large' color={Colors.white} />
    </View>
  )
}
