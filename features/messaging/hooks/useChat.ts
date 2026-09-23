import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getMyConversations,
  getConversationByBookingId,
  getMessages,
  sendMessage as sendMessageApi,
  sendAttachment as sendAttachmentApi,
} from '../api/messaging.api'
import { Conversation, Message } from '../types/message.types'
import type { MessageSender } from '../components/MessageBuddle'
import { tokenService } from '../../../shared/services/token.service'
import { getServerOrigin } from '../../../shared/utils/url.utils'
import { useAuthStore } from '../../../store/auth.store'

export interface ChatMessage {
  id: string
  text: string
  sender: MessageSender
  time: string
  mediaUrl?: string
  contentType?: 'TEXT' | 'IMAGE' | 'AUDIO' | 'SYSTEM'
}

interface UseChatResult {
  messages: ChatMessage[]
  conversation: Conversation | null
  loading: boolean
  connected: boolean
  error: string
  send: (content: string) => void
  sendAttachment: (fileUri: string, caption?: string) => Promise<boolean>
  sendVoiceNote: (audioUri: string, durationSeconds?: number) => Promise<boolean>
}

function buildWsUrl(bookingId: string, token: string): string {
  const wsBase = getServerOrigin().replace(/^http/, 'ws')
  return `${wsBase}/ws/chat/${bookingId}?token=${encodeURIComponent(token)}`
}

export function useChat(bookingId: string): UseChatResult {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [rawMessages, setRawMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const conversationRef = useRef<Conversation | null>(null)

  const formatTime = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { hour: '2-digit', minute: '2-digit' }).format(
      new Date(iso),
    )

  const toChatMessage = useCallback(
    (m: Message): ChatMessage => {
      const sender: MessageSender =
        String(m.senderId) === '0'
          ? 'system'
          : String(m.senderId) === String(user?.id)
            ? 'me'
            : 'traveler'
      return {
        id: m.id,
        text: m.content,
        sender,
        time: formatTime(m.createdAt),
        mediaUrl: m.mediaUrl,
        contentType: m.contentType,
      }
    },
    [user?.id, i18n.language],
  )

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      setLoading(true)
      setError('')
      try {
        let match: Conversation | null = null
        try {
          match = await getConversationByBookingId(bookingId)
        } catch {
          const conversations = await getMyConversations()
          match = conversations.find((c) => String(c.bookingId) === String(bookingId)) ?? null
        }

        if (!match) {
          if (!cancelled) setError(t('messaging.errors.conversation_not_found', 'Conversation not found.'))
          return
        }
        if (cancelled) return
        setConversation(match)
        conversationRef.current = match

        const page = await getMessages(match.id)
        if (!cancelled) setRawMessages(page.content)
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.message ?? t('messaging.errors.load_failed', 'Failed to load conversation.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [bookingId])

  useEffect(() => {
    let socket: WebSocket | null = null
    let cancelled = false

    const connect = async () => {
      const token = await tokenService.getAccessToken()
      if (!token || cancelled) return
      socket = new WebSocket(buildWsUrl(bookingId, token))
      wsRef.current = socket

      socket.onopen = () => setConnected(true)
      socket.onclose = () => setConnected(false)
      socket.onerror = () => setConnected(false)
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.error) {
            setError(data.error)
            return
          }
          setRawMessages((prev) => [data as Message, ...prev])
        } catch {
          // frame malformée, ignorée
        }
      }
    }

    connect()

    return () => {
      cancelled = true
      socket?.close()
      wsRef.current = null
    }
  }, [bookingId])

  useEffect(() => {
    if (!conversation?.id) return
    const interval = setInterval(async () => {
      try {
        const page = await getMessages(conversation.id)
        setRawMessages(page.content)
      } catch {}
    }, 4000)
    return () => clearInterval(interval)
  }, [conversation?.id])

  const send = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return

      const socket = wsRef.current
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ content: trimmed }))
        return
      }

      const currentConversation = conversationRef.current
      if (!currentConversation) {
        setError(t('messaging.errors.send_failed', 'Failed to send message.'))
        return
      }
      sendMessageApi(currentConversation.id, trimmed)
        .then((message) => {
          setRawMessages((prev) => [message, ...prev])
          setError('')
        })
        .catch((err) => {
          setError(err?.response?.data?.message ?? t('messaging.errors.send_failed', 'Failed to send message.'))
        })
    },
    [t],
  )

  const sendAttachment = useCallback(
    async (fileUri: string, caption?: string): Promise<boolean> => {
      const currentConversation = conversationRef.current
      if (!currentConversation) {
        setError(t('messaging.errors.send_failed', 'Failed to send message.'))
        return false
      }
      try {
        const message = await sendAttachmentApi(currentConversation.id, fileUri, caption)
        setRawMessages((prev) => [message, ...prev])
        setError('')
        return true
      } catch (err: any) {
        setError(err?.response?.data?.message ?? t('messaging.errors.send_failed', 'Failed to send attachment.'))
        return false
      }
    },
    [t],
  )

  const sendVoiceNote = useCallback(
    async (audioUri: string, durationSeconds?: number): Promise<boolean> => {
      return sendAttachment(audioUri)
    },
    [sendAttachment],
  )

  return {
    messages: rawMessages.map(toChatMessage),
    conversation,
    loading,
    connected,
    error,
    send,
    sendAttachment,
    sendVoiceNote,
  }
}
