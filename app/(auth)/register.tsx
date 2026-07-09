import { useRouter, useLocalSearchParams } from 'expo-router'
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

export default function RegisterPage() {
  const router = useRouter()
  const { role } = useLocalSearchParams<{ role: RoleChoice }>()

  return (
    <RegisterScreen
      role={role ?? 'BOTH'}
      onBack={() => router.back()}
      onSuccess={(registerDto) => {
        // Inscription réussie → OTP pour confirmer le numéro de téléphone
        // TODO: déclencher POST /auth/otp/send { phone: registerDto.phone } ici
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
