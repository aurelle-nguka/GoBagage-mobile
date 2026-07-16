import { useRouter } from 'expo-router'
import { AdminCorridorsScreen } from '../../features/corridors/screens/AdminCorridorsScreen'

export default function AdminCorridorsPage() {
  const router = useRouter()
  return <AdminCorridorsScreen onBack={() => router.back()} />
}
