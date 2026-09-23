import { useRouter, useLocalSearchParams } from 'expo-router';
import { ResetPasswordScreen } from '../../features/auth/screens/ResetPasswordScreen';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();

  return (
    <ResetPasswordScreen
      initialToken={typeof params.token === 'string' ? params.token : ''}
      onBack={() => router.back()}
      onDone={() => router.replace('/(auth)/login')}
    />
  );
}
