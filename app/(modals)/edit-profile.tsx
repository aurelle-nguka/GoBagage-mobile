import { useRouter } from 'expo-router'
import { EditProfileScreen } from '../../features/profile/screens/EditProfileScreen'
import { useAuthStore } from '../../store/auth.store'
import type { User } from '../../types/user.types'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()

  if (!user) return null

  return (
    <EditProfileScreen
      user={user}
      onBack={() => router.back()}
      onSuccess={(updatedFields) => {
        setUser({ ...user, ...updatedFields } as User)
        router.back()
      }}
    />
  )
}
