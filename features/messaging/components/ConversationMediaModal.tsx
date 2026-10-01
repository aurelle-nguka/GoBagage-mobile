import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X, Image as ImageIcon, Mic, ChevronLeft } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../../../theme'
import { AudioMessagePlayer } from './AudioMessagePlayer'
import { API_BASE_URL } from '../../../shared/constants/api.constants'
import type { ChatMessage } from '../hooks/useChat'

interface ConversationMediaModalProps {
  visible: boolean
  onClose: () => void
  messages: ChatMessage[]
  participantName: string
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GRID_ITEM_SIZE = (SCREEN_WIDTH - 8) / 3

function resolveMediaUrl(url?: string): string | null {
  if (!url) return null
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('file://')
  ) {
    return url
  }
  const serverOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${serverOrigin}${url.startsWith('/') ? '' : '/'}${url}`
}

export function ConversationMediaModal({
  visible,
  onClose,
  messages,
  participantName,
}: ConversationMediaModalProps) {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'images' | 'audios'>('images')
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  const imageMessages = useMemo(() => {
    return messages.filter((m) => {
      const isAudio =
        m.contentType === 'AUDIO' ||
        (m.mediaUrl &&
          (m.mediaUrl.endsWith('.m4a') ||
            m.mediaUrl.endsWith('.aac') ||
            m.mediaUrl.endsWith('.mp3') ||
            m.mediaUrl.endsWith('.wav')))
      return !isAudio && !!m.mediaUrl
    })
  }, [messages])

  const audioMessages = useMemo(() => {
    return messages.filter((m) => {
      const isAudio =
        m.contentType === 'AUDIO' ||
        (m.mediaUrl &&
          (m.mediaUrl.endsWith('.m4a') ||
            m.mediaUrl.endsWith('.aac') ||
            m.mediaUrl.endsWith('.mp3') ||
            m.mediaUrl.endsWith('.wav')))
      return isAudio && !!m.mediaUrl
    })
  }, [messages])

  if (!visible) return null

  const totalCount = imageMessages.length + audioMessages.length

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { paddingTop: Math.max(insets.top, Spacing[4]) },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={24} color={Colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {t('messaging.media.title', 'Médias et documents')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {participantName} · {totalCount}{' '}
              {t('messaging.media.items_count', 'éléments')}
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === 'images' && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab('images')}
            activeOpacity={0.7}
          >
            <ImageIcon
              size={16}
              color={
                activeTab === 'images' ? Colors.primary : Colors.mutedForeground
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'images' && styles.tabTextActive,
              ]}
            >
              {t('messaging.media.tab_photos', 'Photos')} (
              {imageMessages.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === 'audios' && styles.tabItemActive,
            ]}
            onPress={() => setActiveTab('audios')}
            activeOpacity={0.7}
          >
            <Mic
              size={16}
              color={
                activeTab === 'audios' ? Colors.primary : Colors.mutedForeground
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'audios' && styles.tabTextActive,
              ]}
            >
              {t('messaging.media.tab_audios', 'Notes vocales')} (
              {audioMessages.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'images' &&
          (imageMessages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <ImageIcon size={32} color={Colors.mutedForeground} />
              </View>
              <Text style={styles.emptyTitle}>
                {t(
                  'messaging.media.empty_photos_title',
                  'Aucune photo partagée',
                )}
              </Text>
              <Text style={styles.emptySubtitle}>
                {t(
                  'messaging.media.empty_photos_sub',
                  'Les photos et captures échangées dans cette conversation apparaîtront ici.',
                )}
              </Text>
            </View>
          ) : (
            <FlatList
              data={imageMessages}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={[
                styles.gridContainer,
                { paddingBottom: Math.max(insets.bottom, Spacing[4]) + 20 },
              ]}
              renderItem={({ item }) => {
                const fullUrl = resolveMediaUrl(item.mediaUrl)
                if (!fullUrl) return null
                return (
                  <TouchableOpacity
                    style={styles.gridItem}
                    activeOpacity={0.85}
                    onPress={() => setFullscreenImage(fullUrl)}
                  >
                    <Image source={{ uri: fullUrl }} style={styles.gridImage} />
                  </TouchableOpacity>
                )
              }}
            />
          ))}

        {activeTab === 'audios' &&
          (audioMessages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Mic size={32} color={Colors.mutedForeground} />
              </View>
              <Text style={styles.emptyTitle}>
                {t('messaging.media.empty_audios_title', 'Aucun message vocal')}
              </Text>
              <Text style={styles.emptySubtitle}>
                {t(
                  'messaging.media.empty_audios_sub',
                  'Les notes vocales enregistrées et envoyées dans cette conversation apparaîtront ici.',
                )}
              </Text>
            </View>
          ) : (
            <FlatList
              data={audioMessages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.audioListContainer,
                { paddingBottom: Math.max(insets.bottom, Spacing[4]) + 20 },
              ]}
              renderItem={({ item }) => {
                const fullUrl = resolveMediaUrl(item.mediaUrl)
                if (!fullUrl) return null
                const isMe = item.sender === 'me'
                return (
                  <View style={styles.audioCard}>
                    <View style={styles.audioHeader}>
                      <Text style={styles.audioSender}>
                        {isMe
                          ? t('messaging.media.you', 'Vous')
                          : participantName}
                      </Text>
                      <Text style={styles.audioTime}>{item.time}</Text>
                    </View>
                    <View style={styles.audioPlayerWrapper}>
                      <AudioMessagePlayer audioUrl={fullUrl} isMe={false} />
                    </View>
                  </View>
                )
              }}
            />
          ))}

        {fullscreenImage && (
          <Modal
            visible={!!fullscreenImage}
            transparent
            animationType='fade'
            onRequestClose={() => setFullscreenImage(null)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setFullscreenImage(null)}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setFullscreenImage(null)}
              >
                <X size={24} color={Colors.white} />
              </TouchableOpacity>
              <Image
                source={{ uri: fullscreenImage }}
                style={styles.fullImage}
                resizeMode='contain'
              />
            </Pressable>
          </Modal>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
  },
  headerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    marginTop: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.mutedForeground,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  gridContainer: {
    padding: 2,
    gap: 2,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    margin: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  audioListContainer: {
    padding: Spacing[4],
    gap: Spacing[3],
  },
  audioCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  audioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  audioSender: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  audioTime: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },
  audioPlayerWrapper: {
    backgroundColor: '#f8fafc',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  emptyTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.foreground,
    marginBottom: Spacing[1],
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Radius.full,
  },
  fullImage: {
    width: '95%',
    height: '80%',
  },
})
