import { useState } from 'react'
import { useRouter } from 'expo-router'
import { KycQueueScreen } from '../../features/admin/screens/KycQueueScreen'
import { KycReviewScreen } from '../../features/admin/screens/KycReviewScreen'
import { useKycQueue } from '../../features/admin/hooks/useKycQueue'
import type { KycQueueItem } from '../../features/admin/types/admin.types'

export default function KycQueuePage() {
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<KycQueueItem | null>(null)
  const { approve, reject } = useKycQueue()

  if (selectedItem) {
    return (
      <KycReviewScreen
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onApprove={approve}
        onReject={reject}
      />
    )
  }

  return (
    <KycQueueScreen
      onBack={() => router.back()}
      onReviewKyc={(item) => setSelectedItem(item)}
    />
  )
}
