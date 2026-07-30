import { useRouter } from 'expo-router'
import { LanguageScreen } from '../../features/profile/screens/LanguageScreen'

export default function LanguagePage() {
  const router = useRouter()
  return <LanguageScreen onBack={() => router.back()} />
}
