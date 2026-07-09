import { useRouter } from 'expo-router';
import { KycPendingScreen } from '../../features/auth/screens/KycPendingScreen';


export default function KycPendingPage() {
  const router = useRouter();

  return <KycPendingScreen onContinue={() => router.replace('/(tabs)/')} />;
}
