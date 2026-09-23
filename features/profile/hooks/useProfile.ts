import { useState, useEffect, useCallback } from 'react'
import apiClient from '../../../shared/services/api.client'
import { useAuthStore } from '../../../store/auth.store'
import type { ActivityItem } from '../components/RecentActivityRow'

export function mapBookingToActivityItem(
  b: any,
  user: { id?: string | number; roles?: string[] } | null,
  lang: string = 'fr',
): ActivityItem {
  const corridor = b.trip?.corridor
  const from = corridor?.departureCity ?? corridor?.originCity ?? 'Origine'
  const to = corridor?.arrivalCity ?? corridor?.destinationCity ?? 'Destination'

  const isSender = user?.id
    ? String(b.senderId ?? b.sender?.id) === String(user.id)
    : false
  const isTraveler = user?.id
    ? String(b.travelerId ?? b.trip?.traveler?.id ?? b.traveler?.id) === String(user.id)
    : (!isSender && (user?.roles?.includes('TRAVELER') ?? false))

  const isEarning = isTraveler && !isSender
  const amount = isEarning
    ? (Number(b.travelerAmountCad) || 0)
    : -(Number(b.totalAmountCad) || (Number(b.travelerAmountCad) || 0))

  const dateStr = b.createdAt
    ? new Intl.DateTimeFormat(lang, {
        month: 'short',
        day: 'numeric',
      }).format(new Date(b.createdAt))
    : '—'

  return {
    id: String(b.id),
    type: isEarning ? 'trip' : 'parcel',
    from,
    to,
    amount,
    date: dateStr,
    status: b.status ?? 'PENDING',
  }
}

export function useProfile() {
  const { user } = useAuthStore()
  const [tripsCount, setTripsCount] = useState<number>(0)
  const [parcelsSentCount, setParcelsSentCount] = useState<number>(0)
  const [totalEarnings, setTotalEarnings] = useState<number>(0)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProfileData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await apiClient.get('/bookings')
      const raw: any[] = Array.isArray(response.data)
        ? response.data
        : (response.data?.content ?? [])

      const isTravelerRole = user.roles?.includes('TRAVELER') ?? false
      const isSenderRole = user.roles?.includes('SENDER') ?? false

      const completedBookings = raw.filter(
        (b: any) => b.status === 'CONFIRMED' || b.status === 'DELIVERED',
      )

      // Réservations où l'utilisateur est le voyageur
      const travelerCompleted = completedBookings.filter((b: any) => {
        const isSender = String(b.senderId ?? b.sender?.id) === String(user.id)
        const isTrav = String(b.travelerId ?? b.trip?.traveler?.id ?? b.traveler?.id) === String(user.id)
        return isTrav || (!isSender && isTravelerRole)
      })

      // Réservations où l'utilisateur est l'expéditeur
      const senderCompleted = completedBookings.filter((b: any) => {
        return String(b.senderId ?? b.sender?.id) === String(user.id)
      })

      // 1. Total trajets / livraisons
      setTripsCount(
        travelerCompleted.length > 0
          ? travelerCompleted.length
          : (user.totalDeliveries ?? 0),
      )

      // 2. Total colis envoyés
      setParcelsSentCount(
        isSenderRole || senderCompleted.length > 0
          ? senderCompleted.length
          : 0,
      )

      // 3. Total gains (somme des travelerAmountCad sur les réservations voyageur complétées)
      const earningsSum = travelerCompleted.reduce(
        (sum: number, b: any) => sum + (Number(b.travelerAmountCad) || 0),
        0,
      )
      setTotalEarnings(earningsSum)

      // 4. Liste des activités (identique à AllActivityScreen)
      const mapped = raw.map((b: any) => mapBookingToActivityItem(b, user, 'fr'))
      setActivities(mapped)
    } catch (e) {
      setTripsCount(user.totalDeliveries ?? 0)
      setParcelsSentCount(0)
      setTotalEarnings(0)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfileData()
  }, [fetchProfileData])

  return {
    tripsCount,
    parcelsSentCount,
    totalEarnings,
    activities,
    loading,
    refresh: fetchProfileData,
  }
}
