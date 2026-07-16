import { useRouter, useLocalSearchParams } from 'expo-router'
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen'
import { sendOtp } from '../../features/auth/api/auth.api'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

export default function RegisterPage() {
  const router = useRouter()
  const { role } = useLocalSearchParams<{ role: RoleChoice }>()

  return (
    <RegisterScreen
      role={role ?? 'BOTH'}
      onBack={() => router.back()}
      onSuccess={async (registerDto) => {
        try {
          await sendOtp({
            phone: registerDto.phone,
            purpose: 'PHONE_VERIFICATION',
          })
        } catch (err: any) {}

        router.push({
          pathname: '/(auth)/otp',
          params: { role, phone: registerDto.phone },
        })
      }}
      onLogin={() =>
        router.replace({
          pathname: '/(auth)/login',
          params: { role },
        })
      }
    />
  )
}
