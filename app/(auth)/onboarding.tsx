/**
 * Go Bagage — Page Onboarding
 * Après le choix du rôle, on le stocke dans le store puis on redirige vers Login.
 */

import { useRouter } from 'expo-router'
import { UserRole } from '../../types/user.types'
import { useAuthStore } from '../../store/auth.store'
import { OnboardingScreen } from '../../features/auth/screens/OnboardingScreen'

type RoleChoice = 'TRAVELER' | 'SENDER' | 'BOTH'

function roleChoiceToRoles(role: RoleChoice): UserRole[] {
  if (role === 'BOTH') return ['TRAVELER', 'SENDER']
  return [role]
}

export default function OnboardingPage() {
  const router = useRouter()
  const { setSelectedRole } = useAuthStore()

  return (
    <OnboardingScreen
      onComplete={(role: RoleChoice) => {
        setSelectedRole(roleChoiceToRoles(role))
        router.push({
          pathname: '/(auth)/login',
          params: { role },
        })
      }}
    />
  )
}
