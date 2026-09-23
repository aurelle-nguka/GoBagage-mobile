import { useRouter } from 'expo-router'
import { ForgotPasswordScreen } from '../../features/auth/screens/ForgotPasswordScreen'

export default function ForgotPasswordPage() {
  const router = useRouter()

  return (
    <ForgotPasswordScreen
      onBack={() => router.back()}
      onDone={() => router.replace('/(auth)/login')}
      onGoToReset={() => router.push('/(auth)/reset-password')}
    />
  )
}
